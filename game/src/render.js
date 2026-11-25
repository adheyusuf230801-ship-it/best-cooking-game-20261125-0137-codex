import { INGREDIENTS, RECIPES, TUNING, VIEW } from './config.js';
import { binRect, GRILL, grillSlotRect, HUD, PASS, PLATE, RESTART_BUTTON, START_BUTTON, ticketRect, TRASH } from './layout.js';

const ingredient = id => INGREDIENTS.find(item => item.id === id);
const recipe = id => RECIPES.find(item => item.id === id);

function rounded(ctx, x, y, w, h, r, fill, stroke = null, line = 1) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.lineWidth = line; ctx.strokeStyle = stroke; ctx.stroke(); }
}
function text(ctx, value, x, y, size = 16, color = '#362b28', align = 'left', weight = 600) {
  ctx.font = `${weight} ${size}px system-ui, sans-serif`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(value, x, y);
}
function ellipse(ctx, x, y, rx, ry, fill, stroke = null, line = 1) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = line; ctx.stroke(); }
}

export function drawIngredientShape(ctx, id, x, y, w) {
  const item = ingredient(id); if (!item) return;
  const h = Math.max(14, w * 0.31), cx = x + w / 2;
  ctx.save();
  if (id === 'bunBase' || id === 'bunTop') {
    ellipse(ctx, cx, y + h * 0.64, w * 0.48, h * 0.34, item.colors.dark);
    if (id === 'bunTop') {
      ctx.beginPath(); ctx.moveTo(x + 3, y + h * .67); ctx.bezierCurveTo(x + 2, y + h * .04, x + w - 2, y + h * .04, x + w - 3, y + h * .67); ctx.quadraticCurveTo(cx, y + h * .94, x + 3, y + h * .67); ctx.fillStyle = item.colors.main; ctx.fill();
      ellipse(ctx, cx - w * .14, y + h * .27, w * .22, h * .08, 'rgba(255,248,201,.55)');
      for (let i = 0; i < 5; i++) { ellipse(ctx, x + w * (.28 + i * .105), y + h * (.31 + (i % 2) * .08), 2.2, 1.2, '#fff3c1'); }
    } else ellipse(ctx, cx, y + h * .58, w * .48, h * .30, item.colors.main);
  } else if (id === 'patty') {
    ellipse(ctx, cx, y + h * .62, w * .48, h * .34, '#3d211a'); ellipse(ctx, cx, y + h * .50, w * .48, h * .33, '#79402e', '#51291f', 2);
    for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(235,167,111,.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w * (.22 + i * .22), y + h * .34); ctx.lineTo(x + w * (.30 + i * .22), y + h * .68); ctx.stroke(); }
  } else if (id === 'cheese') {
    ctx.beginPath(); ctx.moveTo(x + w * .05, y + h * .20); ctx.lineTo(x + w * .95, y + h * .20); ctx.lineTo(x + w * .9, y + h * .65); ctx.lineTo(x + w * .78, y + h * .55); ctx.lineTo(x + w * .69, y + h * .94); ctx.lineTo(x + w * .58, y + h * .57); ctx.lineTo(x + w * .25, y + h * .70); ctx.lineTo(x + w * .19, y + h * .53); ctx.lineTo(x + w * .08, y + h * .61); ctx.closePath(); ctx.fillStyle = '#ffc942'; ctx.fill(); ctx.strokeStyle = '#df8c26'; ctx.lineWidth = 1.5; ctx.stroke();
  } else if (id === 'lettuce') {
    ctx.beginPath(); ctx.moveTo(x + 2, y + h * .6); for (let i = 0; i <= 8; i++) { const xx = x + i * w / 8; ctx.lineTo(xx, y + h * (.33 + (i % 2) * .16)); } ctx.lineTo(x + w - 2, y + h * .73); ctx.quadraticCurveTo(cx, y + h, x + 2, y + h * .73); ctx.closePath(); ctx.fillStyle = '#67b64c'; ctx.fill(); ctx.strokeStyle = '#3d8340'; ctx.stroke();
  } else if (id === 'tomato') {
    ellipse(ctx, cx, y + h * .56, w * .46, h * .34, '#ad303a'); ellipse(ctx, cx, y + h * .48, w * .46, h * .32, '#ee594e', '#bc3e43', 2);
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; ellipse(ctx, cx + Math.cos(a) * w * .19, y + h * .48 + Math.sin(a) * h * .13, 2.2, 3.2, '#ffd88a'); }
  } else if (id === 'egg') {
    ellipse(ctx, cx, y + h * .58, w * .47, h * .35, '#fffdf0', '#e8dfbe', 2); ellipse(ctx, cx + w * .03, y + h * .49, w * .19, h * .18, '#ffcb45', '#d99a2c', 2); ellipse(ctx, cx - w * .015, y + h * .44, w * .085, h * .04, 'rgba(255,255,220,.65)');
  } else if (id === 'bacon') {
    ctx.beginPath(); ctx.moveTo(x + 3, y + h * .6); for (let i = 0; i < 12; i++) { const xx = x + 3 + i * (w - 6) / 11; ctx.lineTo(xx, y + h * (.35 + Math.sin(i * 1.8) * .16)); } ctx.strokeStyle = '#833b38'; ctx.lineWidth = h * .34; ctx.lineCap = 'round'; ctx.stroke(); ctx.strokeStyle = '#e58a68'; ctx.lineWidth = h * .17; ctx.stroke();
  }
  ctx.restore();
}

function stack(ctx, ids, x, bottom, width, layer = 18) {
  ids.forEach((id, i) => drawIngredientShape(ctx, id, x - width / 2, bottom - (i + 1) * layer, width));
}
function drawBackground(ctx) {
  ctx.fillStyle = '#ead9bb'; ctx.fillRect(0, 36, VIEW.w, 412);
  for (let y = 42; y < 430; y += 44) {
    ctx.fillStyle = y % 88 ? 'rgba(157,103,65,.045)' : 'rgba(255,249,224,.27)'; ctx.fillRect(0, y, VIEW.w, 1);
    for (let x = (y / 44 % 2) * 46; x < VIEW.w; x += 92) { ctx.fillStyle = 'rgba(130,89,61,.035)'; ctx.fillRect(x, y, 1, 44); }
  }
  ctx.fillStyle = '#b87c52'; ctx.fillRect(0, 36, VIEW.w, 12);
  for (const x of [165, 640, 1110]) {
    ctx.fillStyle = '#5e4540'; ctx.fillRect(x - 2, 36, 4, 36); ctx.fillStyle = '#d6a354'; ctx.beginPath(); ctx.moveTo(x - 31, 75); ctx.quadraticCurveTo(x, 112, x + 31, 75); ctx.closePath(); ctx.fill(); ellipse(ctx, x, 76, 31, 7, '#f1c46d');
  }
  ctx.fillStyle = '#9a6244'; ctx.fillRect(0, 408, VIEW.w, 14); ctx.fillStyle = '#d49a5e'; ctx.fillRect(0, 422, VIEW.w, 9);
  ctx.fillStyle = '#75482f'; ctx.fillRect(0, 430, VIEW.w, 370);
  for (let y = 438; y < VIEW.h; y += 37) { ctx.fillStyle = 'rgba(255,194,117,.14)'; ctx.fillRect(0, y, VIEW.w, 2); }
  for (let x = 80; x < VIEW.w; x += 210) { ctx.fillStyle = 'rgba(49,28,23,.16)'; ctx.fillRect(x, 434, 4, 366); }
}
function drawHud(ctx, game) {
  ctx.fillStyle = '#342d2b'; ctx.fillRect(HUD.x, HUD.y, HUD.w, HUD.h);
  const fraction = Math.max(0, game.timeLeft / TUNING.shiftSeconds);
  rounded(ctx, 18, 10, 220, 16, 7, '#5b5150'); rounded(ctx, 18, 10, 220 * fraction, 16, 7, fraction > .45 ? '#77bf69' : fraction > .2 ? '#e7aa48' : '#e65b4c');
  const seconds = Math.ceil(game.timeLeft), clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  text(ctx, clock, 250, 18, 17, '#fff4da'); ellipse(ctx, 342, 18, 10, 10, '#f4c64f', '#9e622f', 2); text(ctx, String(game.coins), 360, 18, 17, '#fff4da');
  text(ctx, game.combo >= 3 ? `${game.combo}x 🔥` : `${game.combo}x`, 475, 18, 17, game.combo >= 3 ? '#ffad63' : '#fff4da', 'left', 700);
  text(ctx, '★'.repeat(Math.max(0, game.stars)) + '☆'.repeat(Math.max(0, 3 - game.stars)), 620, 18, 18, '#ffd45d');
  text(ctx, `RUSH  LV ${game.level}`, 1248, 18, 16, '#fff4da', 'right', 750);
}
function drawTickets(ctx, game) {
  rounded(ctx, 10, 41, 1260, 12, 5, '#724531');
  game.orderBook.orders.forEach((order, i) => {
    const r = ticketRect(i), shake = order.shake > 0 ? Math.sin(order.shake * 75) * order.shake * 22 : 0;
    ctx.save(); ctx.translate(shake, 0);
    const matched = game.orderBook.findMatch(game.plate.ids()) === order;
    const pulse = (Math.sin(game.time * 4) + 1) / 2;
    const border = matched ? `hsl(43, 90%, ${56 + pulse * 22}%)` : order.special ? '#d6a128' : '#c9b99c';
    rounded(ctx, r.x, r.y, r.w, r.h, 7, matched ? '#fff5d5' : '#fffaf0', border, matched || order.special ? 4 : 2);
    ellipse(ctx, r.x + r.w / 2, r.y + 3, 8, 5, '#dc6952', '#a83c36', 1);
    const left = r.x + 13, rec = order.recipe;
    text(ctx, rec.name, left, r.y + 28, 17, '#45332d', 'left', 750);
    if (order.special) {
      rounded(ctx, r.x + r.w - 65, r.y + 16, 56, 21, 5, '#ffe49a', '#d6a128', 1);
      text(ctx, '★ 2x', r.x + r.w - 37, r.y + 27, 14, '#805616', 'center', 800);
    }
    const layerW = 42;
    rec.stack.forEach((id, j) => drawIngredientShape(ctx, id, left + j * 45, r.y + 43, layerW));
    const ratio = Math.max(0, order.patience / order.maxPatience), barColor = ratio > .55 ? '#79b96a' : ratio > .27 ? '#e6a446' : '#db594b';
    rounded(ctx, left, r.y + 98, r.w - 26, 9, 5, '#e7dfd0'); rounded(ctx, left, r.y + 98, (r.w - 26) * ratio, 9, 5, barColor);
    text(ctx, `${Math.ceil(order.patience)}s`, left, r.y + 120, 13, '#75645b'); text(ctx, `$${rec.price * (order.special ? 2 : 1)}`, r.x + r.w - 14, r.y + 120, 15, '#527b43', 'right', 750);
    ctx.restore();
  });
}
function drawStations(ctx, game) {
  rounded(ctx, GRILL.x, GRILL.y, GRILL.w, GRILL.h, 8, '#555c5d', '#303738', 3);
  rounded(ctx, GRILL.x + 9, GRILL.y + 10, GRILL.w - 18, GRILL.h - 20, 5, '#858b88', '#bbc0b8', 2);
  for (let i = 0; i < 3; i++) {
    const r = grillSlotRect(i), state = game.grill.slotState(i);
    rounded(ctx, r.x, r.y, r.w, r.h, 10, '#424a49', '#c2c5bc', 2);
    for (let k = 0; k < 4; k++) { ctx.strokeStyle = '#717977'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(r.x + 8, r.y + 13 + k * 22); ctx.lineTo(r.x + r.w - 8, r.y + 13 + k * 22); ctx.stroke(); }
    if (state) {
      const color = state.phase === 'raw' ? '#9d6651' : state.phase === 'perfect' ? '#784331' : state.phase === 'over' ? '#4c3027' : '#292522';
      if (state.phase === 'perfect') {
        const glow = ctx.createRadialGradient(r.x + 50, r.y + 50, 12, r.x + 50, r.y + 50, 48);
        glow.addColorStop(0, 'rgba(255,209,91,.5)'); glow.addColorStop(1, 'rgba(255,209,91,0)');
        ellipse(ctx, r.x + 50, r.y + 50, 48, 40, glow);
      }
      ellipse(ctx, r.x + 50, r.y + 50, 35, 23, color, '#281c19', 2);
      ctx.beginPath(); ctx.arc(r.x + 50, r.y + 50, 42, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * state.progress); ctx.strokeStyle = state.phase === 'perfect' ? '#f5c54e' : '#dc7252'; ctx.lineWidth = 4; ctx.stroke();
      if (state.phase === 'perfect') for (let s = 0; s < 4; s++) {
        const age = (game.time * .45 + s / 4 + i * .17) % 1;
        const x = r.x + 30 + s * 13 + Math.sin(game.time * 1.4 + s) * 4;
        const radius = 3 + age * 5;
        ellipse(ctx, x, r.y + 31 - age * 43, radius, radius, `rgba(255,247,222,${.3 * Math.sin(age * Math.PI)})`);
      }
      if (state.phase === 'burnt') for (let s = 0; s < 3; s++) { ctx.strokeStyle = `rgba(220,220,208,${.55 - s * .12})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(r.x + 38 + s * 12, r.y + 25); ctx.quadraticCurveTo(r.x + 28 + s * 17, r.y + 7, r.x + 42 + s * 9, r.y - 3); ctx.stroke(); }
      text(ctx, ingredient(state.ingId).name, r.x + 50, r.y + 92, 12, '#fff0d6', 'center', 700);
    }
  }
  text(ctx, 'GRILL', GRILL.x + GRILL.w / 2, GRILL.y + 161, 18, '#faf0dc', 'center', 800);
  rounded(ctx, PLATE.x, PLATE.y, PLATE.w, PLATE.h, 9, '#d8b985', '#845b3c', 2);
  ellipse(ctx, 640, 537, 133, 96, '#f5eee0', '#ab9672', 5); ellipse(ctx, 640, 537, 111, 78, '#fffaf0', '#e4d8c2', 2);
  if (game.plate.stack.length) stack(ctx, game.plate.stack, 640, 570, 148, 22);
  else { ctx.setLineDash([6, 5]); ellipse(ctx, 640, 543, 61, 31, 'rgba(165,151,128,.08)', '#c9baa0', 2); ctx.setLineDash([]); text(ctx, 'plate', 640, 602, 15, '#a59780', 'center'); }
  rounded(ctx, TRASH.x, TRASH.y, TRASH.w, TRASH.h, 7, '#b95b4a', '#743b35', 2); text(ctx, '⌫  TRASH', TRASH.x + 75, TRASH.y + 26, 16, '#fff5e4', 'center', 800);
  rounded(ctx, PASS.x, PASS.y, PASS.w, PASS.h, 9, '#bd8250', '#76472f', 3);
  ctx.fillStyle = '#e4b775'; ctx.fillRect(PASS.x + 7, PASS.y + 66, PASS.w - 14, 20); ctx.fillStyle = '#8d5737'; ctx.fillRect(PASS.x + 7, PASS.y + 88, PASS.w - 14, 8);
  rounded(ctx, PASS.x + 140, PASS.y - 17, 120, 36, 5, '#f3d17d', '#895735', 2); text(ctx, 'PASS', PASS.x + 200, PASS.y + 1, 18, '#65452f', 'center', 800);
  if (game.passPlate?.length) stack(ctx, game.passPlate, 1052, PASS.y + 83, 125, 19);
}
function drawBins(ctx) {
  INGREDIENTS.forEach((item, i) => {
    const r = binRect(i); rounded(ctx, r.x, r.y, r.w, r.h, 5, '#a56d43', '#633d2c', 2);
    ctx.fillStyle = '#c58c54'; ctx.fillRect(r.x + 4, r.y + 4, r.w - 8, 8); ctx.fillStyle = 'rgba(65,38,28,.18)'; ctx.fillRect(r.x + 7, r.y + 16, r.w - 14, r.h - 22);
    for (let k = 0; k < 3; k++) { ctx.strokeStyle = '#70452e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(r.x + 5, r.y + 25 + k * 32); ctx.lineTo(r.x + r.w - 5, r.y + 25 + k * 32); ctx.stroke(); }
    drawIngredientShape(ctx, item.id, r.x + 29, r.y + 20, 82);
    text(ctx, item.name, r.x + r.w / 2, r.y + 101, 12, '#fff1d3', 'center', 750);
    if (item.kind === 'grill') { ellipse(ctx, r.x + r.w - 15, r.y + 17, 10, 10, '#e77a40'); text(ctx, '♨', r.x + r.w - 15, r.y + 17, 13, '#fff2d2', 'center', 800); }
  });
}
function drawEffects(ctx, game) {
  for (const p of game.particles) { ctx.globalAlpha = Math.max(0, p.time); if (p.coin) ellipse(ctx, p.x, p.y, 4, 4, p.color, '#ba852f', 1); else ellipse(ctx, p.x, p.y, 3, 3, p.color); }
  ctx.globalAlpha = 1;
  for (const f of game.floaters) { ctx.globalAlpha = Math.min(1, f.time * 2); text(ctx, f.text, f.x, f.y, 22, f.color, 'center', 850); }
  ctx.globalAlpha = 1;
  if (game.message) { rounded(ctx, 425, 360, 430, 58, 12, '#382d29', '#edc273', 3); text(ctx, game.message.text, 640, 389, 21, '#fff2cf', 'center', 800); }
}
function button(ctx, rect, label) { rounded(ctx, rect.x, rect.y, rect.w, rect.h, 9, '#dc7350', '#843f32', 3); text(ctx, label, rect.x + rect.w / 2, rect.y + rect.h / 2, 25, '#fff7e6', 'center', 850); }
function drawOverlay(ctx, game) {
  if (!['title', 'paused', 'over'].includes(game.state)) return;
  ctx.fillStyle = 'rgba(28,23,24,.64)'; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  rounded(ctx, 300, 94, 680, 640, 17, '#f4e4c6', '#79543a', 4);
  if (game.state === 'title') {
    stack(ctx, ['bunBase', 'patty', 'cheese', 'lettuce', 'tomato', 'bunTop'], 640, 335, 166, 33);
    text(ctx, 'SIZZLE PANIC!', 640, 388, 47, '#663b2e', 'center', 900);
    text(ctx, 'a rush-hour cooking game', 640, 430, 20, '#89664c', 'center', 650);
    text(ctx, 'Click bins to build • grill patty, bacon & egg', 640, 484, 18, '#55453a', 'center');
    text(ctx, 'Click a ticket to serve before patience runs out', 640, 516, 18, '#55453a', 'center');
    text(ctx, 'Keys 1–8: ingredients   Space: serve   Backspace: clear', 640, 548, 16, '#55453a', 'center');
    button(ctx, START_BUTTON, 'START SHIFT');
  } else if (game.state === 'paused') {
    text(ctx, 'PAUSED', 640, 338, 44, '#663b2e', 'center', 900); text(ctx, 'Press P to return to the rush', 640, 402, 20, '#71563f', 'center');
  } else {
    text(ctx, 'SHIFT OVER', 640, 294, 42, '#663b2e', 'center', 900);
    text(ctx, `${game.coins} coins earned`, 640, 366, 23, '#584438', 'center', 750);
    text(ctx, `${game.served} dishes served`, 640, 408, 20, '#584438', 'center');
    text(ctx, `Best combo  x${game.bestCombo}`, 640, 448, 20, '#584438', 'center');
    text(ctx, `Customers lost  ${game.missed}`, 640, 488, 20, '#584438', 'center');
    text(ctx, `Rating  ${'★'.repeat(Math.max(0, game.stars))}${'☆'.repeat(Math.max(0, 3 - game.stars))}`, 640, 528, 22, '#aa762c', 'center');
    button(ctx, RESTART_BUTTON, 'RESTART');
  }
}

export function drawGame(ctx, game) {
  ctx.clearRect(0, 0, VIEW.w, VIEW.h); drawBackground(ctx); drawHud(ctx, game); drawTickets(ctx, game); drawStations(ctx, game); drawBins(ctx); drawEffects(ctx, game); drawOverlay(ctx, game);
}
