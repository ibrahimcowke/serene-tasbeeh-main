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
}
