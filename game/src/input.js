import { VIEW } from './config.js';

export class Input {
  constructor(canvas) {
    this.pointer = { x: 0, y: 0 };
    this.keysDown = new Set();
    this.pressedOnce = new Set();
    this.clicks = [];
    const locate = event => {
      const rect = canvas.getBoundingClientRect();
      this.pointer = {
        x: (event.clientX - rect.left) * VIEW.w / (rect.width || 1),
        y: (event.clientY - rect.top) * VIEW.h / (rect.height || 1),
      };
    };
    canvas.addEventListener('pointermove', locate);
    canvas.addEventListener('pointerdown', event => {
      locate(event);
      if (event.button !== 0) return;
      this.clicks.push({ ...this.pointer });
      event.preventDefault();
    });
    window.addEventListener('keydown', event => {
      if (!this.keysDown.has(event.code) && !event.repeat) this.pressedOnce.add(event.code);
      this.keysDown.add(event.code);
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
    });
    window.addEventListener('keyup', event => { this.keysDown.delete(event.code); });
    window.addEventListener('blur', () => {
      this.keysDown.clear();
      this.pressedOnce.clear();
      this.clicks.length = 0;
    });
  }

  consumeClicks() {
    const clicks = this.clicks;
    this.clicks = [];
    return clicks;
  }

  consumePressed(code) {
    return this.pressedOnce.delete(code);
  }
}
