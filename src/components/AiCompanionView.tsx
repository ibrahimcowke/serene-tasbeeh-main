import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Key, AlertCircle, Play, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { toast } from 'sonner';
import { getNextPrayer } from '@/lib/prayerTimes';

interface AiCompanionViewProps {
  children: React.ReactNode;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  hadith?: string;
  story?: string;
  recommendation?: {
    dhikrId: string;
    arabic: string;
    transliteration: string;
    translation: string;
  };
}

export function AiCompanionView({ children }: AiCompanionViewProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tasbeehly_gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const dhikrs = useTasbeehStore((s) => s.dhikrs);
  const setDhikr = useTasbeehStore((s) => s.setDhikr);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tasbeehly_ai_companion_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved chat history:', e);
      }
    }
    return [
      { 
        sender: 'ai', 
        text: "As-salamu alaykum. I am your Dhikr Companion. Tell me how you feel today (e.g., anxious, grateful, seeking forgiveness, stressed) and I will suggest the best remembrance for your heart." 
      }
    ];
  });

  // Save messages to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('tasbeehly_ai_companion_history', JSON.stringify(messages));
  }, [messages]);

  // Cancel any active SpeechSynthesis on component unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel speech when sheet is closed
  useEffect(() => {
    if (!open) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingIndex(null);
    }
  }, [open]);

  const handleSaveApiKey = () => {
    localStorage.setItem('tasbeehly_gemini_api_key', apiKey.trim());
    toast.success('Gemini API Key saved locally!');
    setShowKeyInput(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const initialGreeting: ChatMessage[] = [
        { 
          sender: 'ai', 
          text: "As-salamu alaykum. I am your Dhikr Companion. Tell me how you feel today (e.g., anxious, grateful, seeking forgiveness, stressed) and I will suggest the best remembrance for your heart." 
        }
      ];
      setMessages(initialGreeting);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingIndex(null);
      toast.success('Chat history cleared!');
    }
  };

  const handleStartCounting = (rec: NonNullable<ChatMessage['recommendation']>) => {
    let targetId = rec.dhikrId;
    // Map API or fallback return value 'salawat' to 'allahuma-sali'
    if (targetId === 'salawat') {
      targetId = 'allahuma-sali';
    }
    const selected = dhikrs.find(d => d.id === targetId) || dhikrs[0];
    setDhikr(selected);
    toast.success(`${rec.transliteration} loaded in counter! 📿`);
    setOpen(false);
  };

  const handleSpeech = (msg: ChatMessage, index: number) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported on this device.');
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Build the text to be spoken (skipping Arabic characters as they may sound garbled in English engines)
    let speakText = msg.text;
    if (msg.recommendation) {
      speakText += `. Recommended remembrance: ${msg.recommendation.transliteration}. Meaning: ${msg.recommendation.translation}.`;
    }
    if (msg.hadith) {
      speakText += ` Hadith: ${msg.hadith}`;
    }
    if (msg.story) {
      speakText += ` Story: ${msg.story}`;
    }

    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.lang = 'en-US';
    utterance.onend = () => {
      setSpeakingIndex(null);
    };
    utterance.onerror = () => {
      setSpeakingIndex(null);
    };

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const offlineFallback = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    
    // 1. Prayer/Salah
    if (q.includes('prayer') || q.includes('salah') || q.includes('namaz') || q.includes('time') || q.includes('fajr') || q.includes('dhuhr') || q.includes('asr') || q.includes('maghrib') || q.includes('isha')) {
      const cached = localStorage.getItem('tasbeehly_prayer_times_cache');
      let text = "Prayer is the connection between the servant and the Creator. Keeping watch over prayer times brings discipline and peace to the soul.";
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.times && parsed.times.length > 0) {
            const next = getNextPrayer(parsed.times);
            const timesList = parsed.times.map((t: any) => `${t.label}: ${t.time}`).join('\n• ');
            text = `Here are today's local prayer times:\n\n• ${timesList}`;
            if (next) {
              text += `\n\nNext prayer is ${next.prayer.label} in about ${next.minutesUntil} minutes (${next.prayer.time}).`;
            }
          }
        } catch {}
      }
      return {
        sender: 'ai',
        text: text,
        hadith: "The likeness of the five daily prayers is that of a deep river flowing past the door of one of you in which he bathes five times a day.",
        story: "A busy merchant committed to praying every Salah at its prime time, finding his stress dissolved and his daily affairs blessed with ease.",
        recommendation: {
          dhikrId: 'subahanallah',
          arabic: 'سُبْحَانَ ٱللَّٰهِ',
          transliteration: 'Subhan-Allah',
          translation: 'Glory be to Allah'
        }
      };
    }

    // 2. Forgiveness/Repentance
    if (q.includes('forgive') || q.includes('sorry') || q.includes('sin') || q.includes('mistake') || q.includes('repent')) {
      return {
        sender: 'ai',
        text: "Seeking forgiveness cleanses the heart and opens the doors of mercy. Reciting 'Astaghfirullah' helps lift the burden of guilt.",
        hadith: "If anyone constantly seeks pardon (from Allah), Allah will appoint for him a way out of every distress, and a relief from every anxiety.",
        story: "A young man carrying years of secret guilt began making constant Istighfar daily, eventually finding deep internal peace and a corrected path.",
        recommendation: {
          dhikrId: 'astaghfirullah',
          arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
          transliteration: 'Astaghfirullah',
          translation: 'I seek forgiveness from Allah'
        }
      };
    }
    
    // 3. Anxiety/Stress/Sadness
    if (q.includes('anxious') || q.includes('worry') || q.includes('scared') || q.includes('fear') || q.includes('stress') || q.includes('sad')) {
      return {
        sender: 'ai',
        text: "Verily, in the remembrance of Allah do hearts find rest. When facing hardships or anxiety, declare Allah's ultimate sovereignty.",
        hadith: "How wonderful is the affair of the believer, for there is good for him in every matter... If he is afflicted with adversity he is patient, and it is good for him.",
        story: "During a period of severe financial distress, a father kept reciting 'La ilaha illallah' continuously, finding the calmness to navigate the storm until relief arrived.",
        recommendation: {
          dhikrId: 'la-ilaha-illallah',
          arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
          transliteration: 'La ilaha illallah',
          translation: 'There is no god but Allah'
        }
      };
    }

    // 4. Gratitude
    if (q.includes('thank') || q.includes('grateful') || q.includes('happy') || q.includes('bless') || q.includes('good')) {
      return {
        sender: 'ai',
        text: "If you are grateful, I will surely increase you. Reciting 'Alhamdulillah' multiplies blessings and anchors joy in gratitude.",
        hadith: "Allah is pleased with His servant who says: 'Alhamdulillah' when he takes a bite of food and when he takes a drink.",
        story: "A farmer who lost half his crop thanked Allah for the half that remained; his gratitude sustained his family and the next harvest was doubled.",
        recommendation: {
          dhikrId: 'alhamdulillah',
          arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
          transliteration: 'Alhamdulillah',
          translation: 'Praise be to Allah'
        }
      };
    }

    // 5. Tired/Weakness
    if (q.includes('tired') || q.includes('weak') || q.includes('exhausted') || q.includes('lazy')) {
      return {
        sender: 'ai',
        text: "When physical or mental exhaustion takes over, calling upon Allah's absolute power restores strength and determination.",
        hadith: "Shall I not direct you to something better than what you have requested? When you go to bed, say 'SubhanAllah' 33 times, 'Alhamdulillah' 33 times, and 'Allahu Akbar' 34 times.",
        story: "Fatima (r.a.) went to the Prophet ﷺ seeking a helper due to exhaustion from work, and he advised her to recite these words, giving her unmatched energy.",
        recommendation: {
          dhikrId: 'allahuakbar',
          arabic: 'ٱللَّٰهُ أَكْبَرُ',
          transliteration: 'Allahu Akbar',
          translation: 'Allah is the Greatest'
        }
      };
    }

    // 6. Allahu Akbar (Greatness/Power)
    if (q.includes('great') || q.includes('power') || q.includes('allahuakbar') || q.includes('majesty')) {
      return {
        sender: 'ai',
        text: "Declaring 'Allahu Akbar' reminds us that Allah is greater than any obstacle, challenge, or giant task in our lives.",
        hadith: "The most beloved speech to Allah consists of four words: SubhanAllah, Alhamdulillah, La ilaha illallah, and Allahu Akbar.",
        story: "A traveler facing a terrifying mountain pass repeatedly declared Allah's greatness, finding the courage to cross safely as his fears diminished.",
        recommendation: {
          dhikrId: 'allahuakbar',
          arabic: 'ٱللَّٰهُ أَكْبَرُ',
          transliteration: 'Allahu Akbar',
          translation: 'Allah is the Greatest'
        }
      };
    }

    // 7. Salawat (Prophet/Muhammad)
    if (q.includes('salawat') || q.includes('prophet') || q.includes('muhammad') || q.includes('peace') || q.includes('messenger')) {
      return {
        sender: 'ai',
        text: "Sending blessings upon the Prophet ﷺ is a key to having your worries removed and your sins forgiven.",
        hadith: "Whoever sends blessings upon me once, Allah will send blessings upon him tenfold.",
        story: "Ubayy ibn Ka'b asked if he should dedicate all his supplications to sending blessings upon the Prophet, and the Prophet ﷺ said: 'Then your worries will be sufficient and your sins forgiven.'",
        recommendation: {
          dhikrId: 'allahuma-sali',
          arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
          transliteration: 'Allahumma Salli Ala Muhammad (SCW)',
          translation: 'O Allah, send blessings upon Muhammad (SCW)'
        }
      };
    }

    // Default fallback
    return {
      sender: 'ai',
      text: "Exalting Allah brings tranquility to the soul. Reciting 'SubhanAllah' praises His infinite perfection above all concerns.",
      hadith: "Two words are light on the tongue, heavy in the scale, and beloved to the Most Merciful: Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim.",
      story: "A fisherman facing a silent sea began praising Allah repeatedly, finding quiet contentment and eventually returning with a bountiful catch.",
      recommendation: {
        dhikrId: 'subahanallah',
        arabic: 'سُبْحَانَ ٱللَّٰهِ',
        transliteration: 'Subhan-Allah',
        translation: 'Glory be to Allah'
      }
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    if (!apiKey.trim()) {
      // Offline fallback
      setTimeout(() => {
        const reply = offlineFallback(userText);
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: `🔒 Note: To protect your privacy, Tasbeehly does not store global API keys. To enable the live AI Dhikr Companion, tap the key icon 🔑 in the top-right and paste your secure Google AI Studio API key (saved locally on your device only).\n\nHere is your offline recommendation:\n\n${reply.text}`,
          hadith: reply.hadith,
          story: reply.story,
          recommendation: reply.recommendation
        }]);
        setLoading(false);
      }, 900);
      return;
    }

    // Get prayer times context if available
    const cachedPrayerTimesStr = localStorage.getItem('tasbeehly_prayer_times_cache');
    let prayerContext = '';
    if (cachedPrayerTimesStr) {
      try {
        const parsed = JSON.parse(cachedPrayerTimesStr);
        if (parsed && parsed.times && parsed.times.length > 0) {
          const next = getNextPrayer(parsed.times);
          prayerContext = `
            Today's local prayer times: ${parsed.times.map((t: any) => `${t.label}: ${t.time}`).join(', ')}.
            Current local time is: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}.
            ${next ? `The next prayer is ${next.prayer.label} at ${next.prayer.time} (in ${next.minutesUntil} minutes).` : ''}
            If the user asks about prayer times, or mentions prayer/namaz/salah, use this context to answer accurately. You can also recommend specific dhikr related to the upcoming or past prayer time (e.g. morning adhkar before/after Fajr, evening adhkar after Asr/Maghrib, or post-prayer tasbeeh like Tasbih of Fatima after fard prayers).
          `;
        }
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `
              You are a peaceful, spiritual Islamic Dhikr Companion. The user is telling you how they feel: "${userText}".
              ${prayerContext}
              Recommend a specific Dhikr or Dua (e.g. SubhanAllah, Alhamdulillah, Allahu Akbar, Astaghfirullah, La ilaha illallah, or Salawat on the Prophet Muhammad ﷺ) that matches this state.
              Explain the importance of this Dhikr and what rewards they get.
              Provide:
              1. Brief spiritual advice and explanation of what they get by doing this Dhikr (max 3 sentences).
              2. One authentic Hadith showing the virtues of this specific Dhikr/Dua or of remembering Allah.
              3. A short comforting story (1-2 sentences) of how someone passed through severe difficulty, stress, or anxiety by reciting Azkar, Istighfar, or Salawat for the Prophet Muhammad ﷺ.
              4. The Arabic, transliteration, and translation of the Dhikr.
              5. Format your response STRICTLY as a JSON object:
              {
                "advice": "your spiritual advice and benefits here",
                "hadith": "authentic Hadith here",
                "story": "inspiring story of passing difficulty here",
                "dhikrId": "matching-dhikr-id-in-lowercase",
                "arabic": "Arabic text",
                "transliteration": "Transliteration",
                "translation": "English translation"
              }
              Dhikr IDs must match one of: subahanallah, alhamdulillah, allahuakbar, astaghfirullah, la-ilaha-illallah, or salawat.
            ` }] }]
          })
        }
      );

      if (!response.ok) throw new Error('API request failed');

      const json = await response.json();
      const textResponse = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Extract JSON from response
      const jsonStart = textResponse.indexOf('{');
      const jsonEnd = textResponse.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const parsed = JSON.parse(textResponse.substring(jsonStart, jsonEnd + 1));
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: parsed.advice,
          hadith: parsed.hadith,
          story: parsed.story,
          recommendation: {
            dhikrId: parsed.dhikrId,
            arabic: parsed.arabic,
            transliteration: parsed.transliteration,
            translation: parsed.translation
          }
        }]);
      } else {
        throw new Error('Could not parse JSON response');
      }
    } catch (e) {
      console.warn('Gemini API call failed, using offline fallback:', e);
      const reply = offlineFallback(userText);
      setMessages(prev => [...prev, {
        ...reply,
        text: `[API Fallback] ${reply.text}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[80dvh] flex flex-col p-0 pb-[calc(env(safe-area-inset-bottom,0px))]">
        <SheetDescription className="sr-only">
          Chat with the AI Dhikr Companion to get personalized recommendations.
        </SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Companion
                </SheetTitle>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClearHistory}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-muted-foreground/60 hover:text-destructive"
                    title="Clear Chat History"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-muted-foreground/60 hover:text-foreground"
                    title="Configure API Key"
                  >
                    <Key size={16} />
                  </button>
                </div>
              </div>
            </SheetHeader>

            {/* API Key configuration overlay/panel */}
            {showKeyInput && (
              <div className="p-4 bg-primary/5 border-b border-border/20 space-y-2 shrink-0 animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <AlertCircle size={14} />
                  <span>Configure Gemini API Key</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  🔒 Your privacy is important. Enter your secure Google AI Studio Gemini API Key. Your key is stored safely in your device's local storage and only communicates directly with Google's endpoints. If empty, the companion uses a local keyword-matching model.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border/20 text-xs text-foreground focus:outline-none"
                    placeholder="AIzaSy..."
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-4 rounded-2xl border text-xs leading-relaxed space-y-3 relative group ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground border-primary/20 rounded-tr-none' 
                        : 'bg-card text-foreground border-border/20 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    
                    {msg.hadith && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 space-y-1 text-left">
                        <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Authentic Hadith</p>
                        <p className="text-[11px] italic text-foreground/90 leading-relaxed">“{msg.hadith}”</p>
                      </div>
                    )}
                    
                    {msg.story && (
                      <div className="p-3 rounded-xl bg-secondary/80 border border-border/20 space-y-1 text-left">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Inspiring Story</p>
                        <p className="text-[11px] text-foreground/80 font-light leading-normal">“{msg.story}”</p>
                      </div>
                    )}
                    
                    {msg.recommendation && (
                      <div className="p-3 rounded-xl bg-foreground/5 border border-border/20 space-y-2.5">
                        <div className="text-right">
                          <p 
                            className="font-arabic text-xl text-primary"
                            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", direction: 'rtl' }}
                          >
                            {msg.recommendation.arabic}
                          </p>
                          <p className="text-[10px] text-muted-foreground italic mt-0.5">{msg.recommendation.transliteration}</p>
                        </div>
                        <p className="text-[10px] text-foreground/80 font-light">"{msg.recommendation.translation}"</p>
                        <button
                          onClick={() => handleStartCounting(msg.recommendation!)}
                          className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play size={10} className="fill-current" />
                          Start Reciting
                        </button>
                      </div>
                    )}

                    {/* TTS Trigger Icon (AI messages only) */}
                    {msg.sender === 'ai' && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => handleSpeech(msg, idx)}
                          className="p-1 hover:bg-foreground/5 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title={speakingIndex === idx ? "Stop Voice" : "Listen Response"}
                        >
                          {speakingIndex === idx ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card text-foreground border border-border/20 p-4 rounded-2xl rounded-tl-none text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                    <span>Contemplating...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Row & Presets */}
            <div className="p-4 border-t border-border/20 bg-background shrink-0 flex flex-col gap-3">
              {/* Presets */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 select-none shrink-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {[
                  { label: 'Anxious 😰', prompt: 'I feel anxious and worried today.' },
                  { label: 'Grateful 🤲', prompt: 'I am feeling very grateful and happy.' },
                  { label: 'Stressed 😫', prompt: 'I am stressed and overwhelmed with work.' },
                  { label: 'Repentant 😔', prompt: 'I am seeking forgiveness for my mistakes.' },
                  { label: 'Sad 😢', prompt: 'I feel sad and need comfort.' },
                  { label: 'Tired 🥱', prompt: 'I am feeling tired and weak.' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setInput(preset.prompt)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-secondary/80 hover:bg-primary/10 border border-border/40 hover:border-primary/20 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-foreground/5 border border-border/20 text-xs text-foreground focus:outline-none focus:border-primary/50"
                  placeholder="How is your heart feeling today?"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/95 disabled:opacity-50 rounded-2xl transition-all cursor-pointer shadow-md"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
