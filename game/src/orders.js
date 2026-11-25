import { RECIPES } from './config.js';

export class OrderBook {
  constructor(rng) {
    this.rng = rng;
    this.orders = [];
    this.nextSpawnIn = 0;
    this.nextId = 1;
  }

  tick(dt, level, tuning) {
    if (!Number.isFinite(dt) || dt < 0) return [];
    // Rush ramps linearly from level 1 to its maximum at level 7.
    const rush = Math.max(0, Math.min(1, (level - 1) / 6));
    const interval = tuning.spawnStart + (tuning.spawnMin - tuning.spawnStart) * rush;
    const patience = tuning.patienceStart + (tuning.patienceMin - tuning.patienceStart) * rush;
    const expired = [];
    // Advance in event-sized steps so large ticks age new orders correctly.
    let remaining = dt;
    do {
      const step = Math.min(remaining, Math.max(0, this.nextSpawnIn));
      for (const order of this.orders) order.patience -= step;
      for (const order of [...this.orders]) {
        if (order.patience <= 0) {
          expired.push(order);
          this.remove(order);
        }
      }
      remaining -= step;
      this.nextSpawnIn -= step;
      if (this.nextSpawnIn <= 0) {
        if (this.orders.length < tuning.maxOrders) {
          // Intro recipes have extra weight even after the full menu unlocks.
          const pool = level < 3 ? RECIPES.slice(0, 3) : [...RECIPES.slice(0, 3), ...RECIPES];
          this.orders.push({ id: this.nextId++, recipe: this.rng.pick(pool), special: this.rng.next() < 0.25, patience, maxPatience: patience });
        }
        this.nextSpawnIn = Math.max(0.001, interval);
      }
    } while (remaining > 0);
    return expired;
  }

  findMatch(stackIds) {
    return this.orders.find(({ recipe }) => recipe.stack.length === stackIds.length
      && recipe.stack.every((id, i) => id === stackIds[i])) ?? null;
  }

  remove(order) {
    const i = this.orders.indexOf(order);
    if (i !== -1) this.orders.splice(i, 1);
  }

  clear() {
    this.orders.length = 0;
    this.nextSpawnIn = 0;
    this.nextId = 1;
  }
}
