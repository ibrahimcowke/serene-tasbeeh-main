/**
 * Text-to-speech engine for reciting Dhikr in Arabic.
 * Uses the Web Speech API (SpeechSynthesis) supported across standard modern browsers and Capacitor.
 */

export const speakArabic = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported on this device/browser.');
    return;
  }

  try {
    // Stop any speech currently playing
    window.speechSynthesis.cancel();

    // Clean up Arabic text (remove some formatting if necessary, though Arabic Unicode works well)
    const cleanText = text.trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8; // Speak slightly slower for clear articulation
    utterance.pitch = 1.0;

    // Locate a native Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.toLowerCase() === 'ar-sa' || v.lang.toLowerCase().startsWith('ar')
    );

    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    // Force voice reloading check for systems that populate voices asynchronously
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        const updatedArabicVoice = updatedVoices.find(
          (v) => v.lang.toLowerCase() === 'ar-sa' || v.lang.toLowerCase().startsWith('ar')
        );
        if (updatedArabicVoice) {
          utterance.voice = updatedArabicVoice;
        }
        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.onvoiceschanged = null; // Clean up handler
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  } catch (error) {
    console.error('Error during Arabic recitation playback:', error);
  }
};
