export const VIEW = { w: 1280, h: 800 };

// Hue and three shades let renderers draw each ingredient without assets.
export const INGREDIENTS = [
  { id: 'bunBase', name: 'Bottom Bun', kind: 'stack', cookSeconds: 0, perfectStart: 0, perfectEnd: 0, burnSeconds: 0, hue: 35, colors: { light: '#ffdc8c', main: '#dda14d', dark: '#99602d' } },
  { id: 'patty', name: 'Patty', kind: 'grill', cookSeconds: 4.5, perfectStart: 3.0, perfectEnd: 5.5, burnSeconds: 7.5, hue: 20, colors: { light: '#bc7650', main: '#79402e', dark: '#41231f' } },
  { id: 'cheese', name: 'Cheese', kind: 'stack', cookSeconds: 0, perfectStart: 0, perfectEnd: 0, burnSeconds: 0, hue: 44, colors: { light: '#fff18b', main: '#ffc942', dark: '#df8c26' } },
  { id: 'lettuce', name: 'Lettuce', kind: 'stack', cookSeconds: 0, perfectStart: 0, perfectEnd: 0, burnSeconds: 0, hue: 105, colors: { light: '#b8ee78', main: '#72bc50', dark: '#387540' } },
  { id: 'tomato', name: 'Tomato', kind: 'stack', cookSeconds: 0, perfectStart: 0, perfectEnd: 0, burnSeconds: 0, hue: 5, colors: { light: '#ff9b80', main: '#ee594e', dark: '#af303d' } },
  { id: 'egg', name: 'Egg', kind: 'grill', cookSeconds: 3.5, perfectStart: 2.2, perfectEnd: 4.2, burnSeconds: 6.5, hue: 48, colors: { light: '#fffdf0', main: '#ffd45d', dark: '#d69535' } },
  { id: 'bacon', name: 'Bacon', kind: 'grill', cookSeconds: 3.0, perfectStart: 2.0, perfectEnd: 3.6, burnSeconds: 5.5, hue: 12, colors: { light: '#ffc0a1', main: '#cf6554', dark: '#833b38' } },
  { id: 'bunTop', name: 'Top Bun', kind: 'stack', cookSeconds: 0, perfectStart: 0, perfectEnd: 0, burnSeconds: 0, hue: 33, colors: { light: '#ffe3a1', main: '#eeae57', dark: '#ac6a32' } },
];

export const RECIPES = [
  { id: 'classic', name: 'Classic Sizzle', price: 18, stack: ['bunBase', 'patty', 'cheese', 'bunTop'] },
  { id: 'garden', name: 'Garden Stack', price: 15, stack: ['bunBase', 'lettuce', 'tomato', 'cheese', 'bunTop'] },
  { id: 'sunrise', name: 'Sunrise Sizzle', price: 20, stack: ['bunBase', 'patty', 'egg', 'cheese', 'bunTop'] },
  { id: 'double', name: 'Double Trouble', price: 30, stack: ['bunBase', 'patty', 'cheese', 'patty', 'bacon', 'bunTop'] },
  { id: 'melt', name: 'Orchard Melt', price: 24, stack: ['bunBase', 'bacon', 'lettuce', 'tomato', 'cheese', 'bunTop'] },
  { id: 'greenrise', name: 'Green Sunrise', price: 22, stack: ['bunBase', 'egg', 'lettuce', 'tomato', 'bunTop'] },
];

export const TUNING = {
  shiftSeconds: 150, maxOrders: 4, spawnStart: 7, spawnMin: 3.6,
  patienceStart: 48, patienceMin: 30, levelEveryCoins: 120, starsStart: 3,
};
