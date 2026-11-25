export class SoundBoard {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  // Call directly from a pointer or keyboard gesture, never at page load.
  unlock() {
    try {
      const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.context || this.context.state === 'closed') this.context = new AudioContext();
      if (this.context.state === 'suspended') this.context.resume()?.catch(() => {});
    } catch { /* Audio is optional. */ }
  }

  setMuted(value) {
    try { this.muted = Boolean(value); } catch { /* Audio is optional. */ }
  }

  toggleMuted() {
    try { this.setMuted(!this.muted); return this.muted; } catch { return true; }
  }

  tone(frequency, duration, type = 'sine', delay = 0, endFrequency = frequency, volume = 0.07) {
    try {
      const context = this.context;
      if (this.muted || !context || context.state !== 'running') return;
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + duration);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => { try { oscillator.disconnect(); gain.disconnect(); } catch {} };
      oscillator.start(start);
      oscillator.stop(start + duration + 0.01);
    } catch { /* No device, blocked context, or screenshot environment. */ }
  }

  click() { try { this.tone(620, 0.045, 'triangle', 0, 420); } catch {} }
  pop() { try { this.tone(260, 0.10, 'sine', 0, 680); } catch {} }
  sizzle() {
    try {
      // A short, deterministic cluster of harsh tones suggests grill crackle.
      for (let i = 0; i < 6; i++) this.tone(1800 + (i * 733) % 1700, 0.035, 'sawtooth', i * 0.025, 240, 0.012);
    } catch {}
  }
  ding() { try { this.tone(880, 0.18); this.tone(1320, 0.28, 'sine', 0.08); } catch {} }
  buzz() { try { this.tone(155, 0.28, 'sawtooth', 0, 85, 0.045); } catch {} }
  trash() { try { this.tone(320, 0.16, 'triangle', 0, 45); } catch {} }
  levelup() {
    try { [523.25, 659.25, 783.99, 1046.5].forEach((note, i) => this.tone(note, 0.22, 'triangle', i * 0.09)); } catch {}
  }
}
