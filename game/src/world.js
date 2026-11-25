import { INGREDIENTS, RECIPES, TUNING } from './config.js';
import { createRng } from './random.js';
import { Input } from './input.js';
import { SoundBoard } from './audio.js';
import { OrderBook } from './orders.js';
import { Grill, Plate } from './stations.js';
import { binRect, grillSlotRect, PASS, PLATE, START_BUTTON, RESTART_BUTTON, ticketRect, TRASH } from './layout.js';

const inside = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
const recipeById = id => RECIPES.find(r => r.id === id);

export class Game {
  constructor(canvas) {
    const query = Number.parseInt(new URLSearchParams(globalThis.location?.search ?? '').get('seed') ?? '', 10);
    this.rng = createRng(Number.isInteger(query) ? query : 20261125);
    this.input = new Input(canvas);
    this.sound = new SoundBoard();
    this.orderBook = new OrderBook(this.rng);
    this.grill = new Grill();
    this.plate = new Plate();
    this.state = 'title';
    this.time = 0;
    this.passPlate = null;
    this.particles = [];
    this.floaters = [];
    this.message = null;
    this.resetStats();
  }

  resetStats() {
    this.coins = 0; this.combo = 0; this.bestCombo = 0; this.served = 0; this.missed = 0;
    this.stars = TUNING.starsStart; this.timeLeft = TUNING.shiftSeconds; this.level = 1;
    this.particles.length = 0; this.floaters.length = 0; this.shake = 0;
  }

  start() {
    this.resetStats(); this.orderBook.clear(); this.grill.slots.fill(null); this.plate.clear();
    this.orderBook.nextSpawnIn = 1;
    this.passPlate = null; this.message = null; this.state = 'playing';
  }

  banner(text, duration = 1.25) { this.message = { text, time: duration, maxTime: duration }; }
  float(text, x = 640, y = 390, color = '#fff2c7') { this.floaters.push({ text, x, y, vy: -35, time: 1.1, color }); }
  burst(x, y, color, count = 10, coin = false) {
    for (let i = 0; i < count; i++) {
      const a = this.rng.next() * Math.PI * 2, speed = 35 + this.rng.next() * 110;
      this.particles.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 35, time: 0.7 + this.rng.next() * 0.5, color, coin });
    }
  }

  addIngredient(id) {
    const ingredient = INGREDIENTS.find(item => item.id === id);
    if (!ingredient) return;
    if (ingredient.kind === 'grill') {
      if (!this.grill.place(id)) this.sound.buzz();
      else { this.sound.sizzle(); this.float('Sizzle!', 210, 540, '#ffd67a'); }
    } else {
      this.plate.add(id); this.sound.pop(); this.burst(640, 560, ingredient.colors.light, 4);
    }
  }

  serveTicket(order) {
    if (!order || this.orderBook.findMatch(this.plate.ids()) !== order) return false;
    const price = order.recipe.price;
    const tip = Math.round(price * 0.5 * Math.max(0, order.patience) / order.maxPatience);
    const earned = (price + tip) * (order.special ? 2 : 1);
    this.coins += earned; this.combo++; this.bestCombo = Math.max(this.bestCombo, this.combo); this.served++;
    this.orderBook.remove(order); this.plate.clear(); this.passPlate = null;
    this.sound.ding(); this.burst(640, 540, '#ffd45d', 18, true); this.float(`+${earned}`, 640, 480, '#ffe176');
    if (this.combo >= 3) this.float(`${this.combo} COMBO!`, 640, 438, '#ff9a54');
    this.level = 1 + Math.floor(this.coins / TUNING.levelEveryCoins);
    return true;
  }

  handlePoint(point) {
    for (let i = 0; i < INGREDIENTS.length; i++) {
      if (inside(point, binRect(i))) { this.addIngredient(INGREDIENTS[i].id); return; }
    }
    for (let i = 0; i < 3; i++) if (inside(point, grillSlotRect(i))) {
      const item = this.grill.take(i);
      if (!item) return;
      if (item.quality === 'burnt') { this.sound.trash(); this.burst(110 + i * 126, 520, '#66605b', 13); this.float('Burnt!', 110 + i * 126, 480, '#bab0a4'); }
      else { this.plate.add(item.ingId); this.sound.pop(); this.burst(640, 560, '#ffcf72', 7); if (item.quality === 'perfect') { this.coins += 2; this.float('PERFECT! +2', 640, 466, '#ffe176'); } }
      return;
    }
    for (let i = 0; i < this.orderBook.orders.length; i++) if (inside(point, ticketRect(i))) {
      const order = this.orderBook.orders[i];
      if (!this.serveTicket(order)) { order.shake = 0.35; this.sound.buzz(); }
      return;
    }
    if (inside(point, TRASH)) { this.plate.clear(); this.sound.trash(); return; }
    if (inside(point, PASS)) {
      const order = this.orderBook.findMatch(this.plate.ids());
      if (order) this.serveTicket(order); else this.sound.buzz();
    }
  }

  handleKeys() {
    const input = this.input;
    if (input.consumePressed('KeyM')) this.sound.toggleMuted();
    if (input.consumePressed('KeyP') && (this.state === 'playing' || this.state === 'paused')) this.state = this.state === 'playing' ? 'paused' : 'playing';
    if (input.consumePressed('Enter') && (this.state === 'title' || this.state === 'over')) this.start();
    if (this.state !== 'playing') return;
    for (let i = 0; i < 8; i++) if (input.consumePressed(`Digit${i + 1}`)) this.addIngredient(INGREDIENTS[i].id);
    if (input.consumePressed('Backspace')) { this.plate.clear(); this.sound.trash(); }
    if (input.consumePressed('Space')) {
      const order = this.orderBook.findMatch(this.plate.ids());
      if (order) this.serveTicket(order); else this.sound.buzz();
    }
  }

  updateEffects(dt) {
    for (const p of this.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 90 * dt; p.time -= dt; }
    this.particles = this.particles.filter(p => p.time > 0);
    for (const f of this.floaters) { f.y += f.vy * dt; f.time -= dt; }
    this.floaters = this.floaters.filter(f => f.time > 0);
    for (const order of this.orderBook.orders) order.shake = Math.max(0, (order.shake ?? 0) - dt);
    if (this.message) { this.message.time -= dt; if (this.message.time <= 0) this.message = null; }
  }

  update(dt) {
    if (!Number.isFinite(dt) || dt < 0) return;
    this.time += dt;
    this.handleKeys();
    const clicks = this.input.consumeClicks();
    if (this.state === 'title' || this.state === 'over') {
      for (const p of clicks) if (inside(p, this.state === 'title' ? START_BUTTON : RESTART_BUTTON)) this.start();
    } else if (this.state === 'playing') {
      for (const p of clicks) this.handlePoint(p);
      if (this.state !== 'playing') return;
      this.timeLeft = Math.max(0, this.timeLeft - dt);
      const expired = this.orderBook.tick(dt, this.level, TUNING);
      for (const order of expired) { this.missed++; this.stars--; this.combo = 0; this.sound.buzz(); this.float('Too slow!', 640, 360, '#ff9d82'); }
      this.grill.tick(dt);
      if (this.stars <= 0 || this.timeLeft <= 0) { this.state = 'over'; this.message = null; }
    }
    this.updateEffects(dt);
  }
}
