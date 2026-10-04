// Native procedural ambient sound generator using Web Audio API
// Generates Brown Noise, Gentle Rain, or Soft Library Ambience with zero external MP3 assets

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private currentMode: 'off' | 'brown-noise' | 'rain' | 'library' = 'off';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(mode: 'off' | 'brown-noise' | 'rain' | 'library') {
    this.stop();
    if (mode === 'off') {
      this.currentMode = 'off';
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    this.currentMode = mode;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime); // gentle, calm volume
    this.gainNode.connect(this.ctx.destination);

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (mode === 'brown-noise') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // boost gain
      }
    } else if (mode === 'rain') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.04 * white)) / 1.04;
        lastOut = output[i];
        if (Math.random() < 0.002) {
          output[i] += (Math.random() * 0.4); // soft raindrop transient
        }
      }
    } else {
      // Library: filtered low rumble / hum
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Apply lowpass filter for deep warm academic feel
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(mode === 'brown-noise' ? 400 : mode === 'rain' ? 800 : 300, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start(0);

    this.currentSource = whiteNoise;
  }

  public stop() {
    if (this.currentSource) {
      try {
        (this.currentSource as AudioBufferSourceNode).stop();
        this.currentSource.disconnect();
      } catch {
        // ignore already stopped
      }
      this.currentSource = null;
    }
    this.currentMode = 'off';
  }

  public getMode() {
    return this.currentMode;
  }
}

export const soundscapes = new SoundscapeEngine();
