import { RECIPES, TUNING } from './config.js';

export function applyShot(game, name) {
  game.orderBook.clear(); game.grill.slots.fill(null); game.plate.clear();
  game.particles.length = 0; game.floaters.length = 0; game.message = null; game.passPlate = null;
  game.coins = 0; game.combo = 0; game.bestCombo = 0; game.served = 0; game.missed = 0; game.stars = TUNING.starsStart;
  game.timeLeft = TUNING.shiftSeconds; game.level = 1;
  const addOrder = (id, fraction) => {
    const rec = RECIPES.find(item => item.id === id), patience = rec === undefined ? 0 : 50 * fraction;
    game.orderBook.orders.push({ id: game.orderBook.nextId++, recipe: rec, patience, maxPatience: 50 });
  };
  const cook = (slot, ingId, t) => { game.grill.slots[slot] = { ingId, t }; };
  if (name === 'start') { game.state = 'title'; return; }
  game.state = name === 'end' ? 'over' : 'playing';
  if (name === 'play') {
    game.timeLeft = 97; game.coins = 120; game.combo = 3; game.bestCombo = 3; game.served = 5; game.stars = 3;
    addOrder('classic', .7); addOrder('sunrise', .45); cook(0, 'patty', 4); cook(1, 'bacon', 2.8);
    game.plate.stack = ['bunBase', 'patty', 'cheese']; game.passPlate = ['bunBase', 'patty', 'cheese', 'bunTop'];
  } else if (name === 'serve') {
    game.timeLeft = 88; game.coins = 210; game.combo = 5; game.bestCombo = 5; game.served = 8;
    addOrder('classic', .8); addOrder('garden', .55); game.plate.stack = ['bunBase', 'patty', 'cheese'];
    game.plate.stack = ['bunBase', 'patty', 'cheese', 'bunTop']; game.message = { text: 'READY! Click the ticket to serve', time: 999, maxTime: 999 };
    for (let i = 0; i < 7; i++) game.particles.push({ x: 580 + game.rng.next() * 120, y: 505 + game.rng.next() * 48, vx: 0, vy: 0, time: 999, color: '#ffd45d', coin: true });
  } else if (name === 'rush') {
    game.timeLeft = 41; game.coins = 320; game.combo = 6; game.bestCombo = 6; game.served = 11; game.stars = 2;
    addOrder('double', .35); addOrder('melt', .6); addOrder('classic', .25); addOrder('greenrise', .75);
    cook(0, 'patty', 4); cook(1, 'egg', 3); cook(2, 'bacon', 6.2); game.plate.stack = ['bunBase', 'patty'];
  } else if (name === 'end') {
    game.coins = 486; game.served = 16; game.missed = 3; game.bestCombo = 8; game.stars = 1; game.timeLeft = 0;
  }
  game.level = 1 + Math.floor(game.coins / TUNING.levelEveryCoins);
}
