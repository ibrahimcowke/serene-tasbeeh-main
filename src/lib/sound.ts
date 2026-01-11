export class SoundManager {
  private static audioContext: AudioContext | null = null;
  
  private static init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
  
  public static playClick() {
    try {
      this.init();
      if (!this.audioContext) return;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      // Creating a soft "pop" or "contact" sound
      // Short sine wave burst with exponential decay
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.1);
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
}
