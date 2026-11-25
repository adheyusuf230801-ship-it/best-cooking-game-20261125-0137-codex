import { INGREDIENTS } from './config.js';

const ingredients = new Map(INGREDIENTS.map(ingredient => [ingredient.id, ingredient]));

export class Grill {
  constructor() {
    this.slots = [null, null, null];
  }

  place(ingId) {
    if (ingredients.get(ingId)?.kind !== 'grill') return false;
    const i = this.slots.indexOf(null);
    if (i < 0) return false;
    this.slots[i] = { ingId, t: 0 };
    return true;
  }

  tick(dt) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    for (const slot of this.slots) if (slot) slot.t += dt;
  }

  slotState(i) {
    const slot = this.slots[i];
    if (!slot) return null;
    const ingredient = ingredients.get(slot.ingId);
    const phase = slot.t > ingredient.burnSeconds ? 'burnt'
      : slot.t > ingredient.perfectEnd ? 'over'
      : slot.t >= ingredient.perfectStart ? 'perfect' : 'raw';
    return { ...slot, phase, progress: Math.min(1, slot.t / ingredient.cookSeconds) };
  }

  take(i) {
    const state = this.slotState(i);
    if (!state) return null;
    this.slots[i] = null;
    return { ingId: state.ingId, quality: state.phase === 'burnt' ? 'burnt' : state.phase === 'perfect' ? 'perfect' : 'ok' };
  }
}

export class Plate {
  constructor() { this.stack = []; }
  add(id) { this.stack.push(id); }
  clear() { this.stack.length = 0; }
  ids() { return this.stack.slice(); }
}
