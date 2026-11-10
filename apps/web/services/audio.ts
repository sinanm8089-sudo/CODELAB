// Web Audio API Procedural Ambient Sound Generator
export class AmbientAudioEngine {
  private static ctx: AudioContext | null = null;
  private static masterGain: GainNode | null = null;
  private static isPlaying: boolean = false;
  private static activePreset: string = "rain";
  private static nodes: any[] = [];
  private static customAudioElement: HTMLAudioElement | null = null;

  private static initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  static setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
    if (this.customAudioElement) {
      this.customAudioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  static stop() {
    this.nodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {}
    });
    this.nodes = [];
    if (this.customAudioElement) {
      this.customAudioElement.pause();
      this.customAudioElement = null;
    }
    this.isPlaying = false;
  }

  static play(preset: string = "rain", volume: number = 0.5, customUrl?: string) {
    this.initContext();
    this.stop();
    this.activePreset = preset;
    this.setVolume(volume);

    if (customUrl && customUrl.trim()) {
      try {
        this.customAudioElement = new Audio(customUrl.trim());
        this.customAudioElement.loop = true;
        this.customAudioElement.volume = volume;
        this.customAudioElement.play().catch(() => {});
        this.isPlaying = true;
        return;
      } catch {}
    }

    if (!this.ctx || !this.masterGain) return;

    if (preset === "white_noise") {
      this.playWhiteNoise();
    } else if (preset === "rain") {
      this.playRain();
    } else if (preset === "lofi_drone") {
      this.playLofiDrone();
    } else if (preset === "binaural") {
      this.playBinauralBeats();
    } else {
      this.playRain();
    }

    this.isPlaying = true;
  }

  private static playWhiteNoise() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to soft pink/brown noise
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.nodes.push(whiteNoise, filter, gain);
  }

  private static playRain() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    rainSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    rainSource.start();
    this.nodes.push(rainSource, filter, gain);
  }

  private static playLofiDrone() {
    if (!this.ctx || !this.masterGain) return;
    const freqs = [130.81, 164.81, 196.0, 246.94]; // C3 Major 7th chord
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08 / freqs.length, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.nodes.push(osc, filter, gain);
    });
  }

  private static playBinauralBeats() {
    if (!this.ctx || !this.masterGain) return;
    // 210 Hz left, 220 Hz right -> 10 Hz Alpha Wave (Relaxed Focus)
    const baseFreq = 216;
    const diff = 10;

    const merger = this.ctx.createChannelMerger(2);

    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = "sine";
    oscLeft.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    const oscRight = this.ctx.createOscillator();
    oscRight.type = "sine";
    oscRight.frequency.setValueAtTime(baseFreq + diff, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);
    merger.connect(gain);
    gain.connect(this.masterGain);

    oscLeft.start();
    oscRight.start();
    this.nodes.push(oscLeft, oscRight, merger, gain);
  }

  static getStatus() {
    return {
      isPlaying: this.isPlaying,
      activePreset: this.activePreset,
    };
  }
}

