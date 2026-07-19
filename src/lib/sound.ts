export class SoundManager {
  private static audioContext: AudioContext | null = null;
  
  public static init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  public static async resume() {
    this.init();
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {
        console.warn('AudioContext resume failed:', e);
      }
    }
  }
  
  public static playClick(type: 'click' | 'soft' | 'water' = 'click') {
    try {
      this.init();
      if (!this.audioContext) return;
      
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      if (type === 'water') {
        // Water/Bubble sound: Sine sweep down
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'soft') {
         // Soft thud: Triangle wave, low freq
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.1);
      } else {
        // Default Click (Sharp sine)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  }
  
  public static playCompletion() {
    try {
      this.init();
      if (!this.audioContext) return;

      const now = this.audioContext.currentTime;
      
      // Play a nice cheerful chord (Major C)
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.connect(gain);
        gain.connect(this.audioContext!.destination);
        
        osc.start(now + i * 0.05);
        osc.stop(now + 0.6);
      });
    } catch (e) {
      console.error('Completion sound failed', e);
    }
  }

  private static activeAudio: HTMLAudioElement | null = null;

  public static playVoiceReminder(type: 'subhanallah' | 'alhamdulillah' | 'astaghfirullah' | 'salawat' | string) {
    try {
      if (this.activeAudio) {
        this.activeAudio.pause();
        this.activeAudio = null;
      }
      const audio = new Audio(`/sounds/${type}.mp3`);
      this.activeAudio = audio;
      audio.play().catch((err) => console.warn('Failed to play voice preview:', err));
    } catch (e) {
      console.error('Failed to play voice reminder:', e);
    }
  }
}

// ─────────────────────────────────────────────
// Ambient Sound Engine (v2.1.0)
// ─────────────────────────────────────────────

type AmbientType = 'none' | 'rain' | 'water' | 'masjid';

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private currentType: AmbientType = 'none';

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  async play(type: AmbientType, volume: number = 0.3) {
    if (type === 'none') { this.stop(); return; }
    if (type === this.currentType && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(volume, this.getCtx().currentTime, 0.3);
      return;
    }
    this.stop();
    this.currentType = type;
    const ctx = this.getCtx();
    if (ctx.state === 'suspended') await ctx.resume();
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);
    this.masterGain.connect(ctx.destination);
    if (type === 'rain') this.buildRain(ctx);
    else if (type === 'water') this.buildWater(ctx);
    else if (type === 'masjid') this.buildMasjid(ctx);
  }

  setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.3);
    }
  }

  stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
      const nodesToClean = [...this.nodes];
      const gainToClean = this.masterGain;
      setTimeout(() => {
        nodesToClean.forEach((n) => { try { n.disconnect(); } catch {} });
        try { gainToClean.disconnect(); } catch {}
      }, 1500);
    }
    this.nodes = [];
    this.masterGain = null;
    this.currentType = 'none';
  }

  private buildRain(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 2200;
    lpf.Q.value = 0.6;
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 400;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain);
    lfoGain.connect((this.masterGain as GainNode).gain);
    lfo.start();
    source.connect(lpf);
    lpf.connect(hpf);
    hpf.connect(this.masterGain!);
    source.start();
    this.nodes.push(source, lpf, hpf, lfo, lfoGain);
  }

  private buildWater(ctx: AudioContext) {
    const mg = this.masterGain!;
    const type = this.currentType;
    const scheduleGurgle = () => {
      if (this.currentType !== type || !this.masterGain) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startFreq = 300 + Math.random() * 400;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.5, now + 0.3 + Math.random() * 0.4);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + Math.random() * 0.5);
      osc.connect(gain);
      gain.connect(mg);
      osc.start(now);
      osc.stop(now + 1);
      setTimeout(scheduleGurgle, 80 + Math.random() * 200);
    };
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'bandpass';
    lpf.frequency.value = 800;
    lpf.Q.value = 0.5;
    src.connect(lpf);
    lpf.connect(mg);
    src.start();
    this.nodes.push(src, lpf);
    scheduleGurgle();
  }

  private buildMasjid(ctx: AudioContext) {
    [55, 110, 220, 330].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      lfo.frequency.value = 0.03 + i * 0.01;
      lfoGain.gain.value = freq * 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      gain.gain.value = 0.015 / (i + 1);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      lfo.start();
      this.nodes.push(osc, gain, lfo, lfoGain);
    });
  }

  get isPlaying() { return this.currentType !== 'none'; }
  get type() { return this.currentType; }
}

export const ambientEngine = new AmbientEngine();
