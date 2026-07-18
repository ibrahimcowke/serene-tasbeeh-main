import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Key, AlertCircle, Play } from 'lucide-react';
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

  const dhikrs = useTasbeehStore((s) => s.dhikrs);
  const setDhikr = useTasbeehStore((s) => s.setDhikr);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      sender: 'ai', 
      text: "As-salamu alaykum. I am your Dhikr Companion. Tell me how you feel today (e.g., anxious, grateful, seeking forgiveness, stressed) and I will suggest the best remembrance for your heart." 
    }
  ]);

  const handleSaveApiKey = () => {
    localStorage.setItem('tasbeehly_gemini_api_key', apiKey.trim());
    toast.success('Gemini API Key saved locally!');
    setShowKeyInput(false);
  };

  const handleStartCounting = (rec: NonNullable<ChatMessage['recommendation']>) => {
    const selected = dhikrs.find(d => d.id === rec.dhikrId) || dhikrs[0];
    setDhikr(selected);
    toast.success(`${rec.transliteration} loaded in counter! 📿`);
    setOpen(false);
  };

  const offlineFallback = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    
    if (q.includes('prayer') || q.includes('salah') || q.includes('namaz') || q.includes('time') || q.includes('fajr') || q.includes('dhuhr') || q.includes('asr') || q.includes('maghrib') || q.includes('isha')) {
      const cached = localStorage.getItem('tasbeehly_prayer_times_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.times && parsed.times.length > 0) {
            const next = getNextPrayer(parsed.times);
            const timesList = parsed.times.map((t: any) => `${t.label}: ${t.time}`).join('\n• ');
            let text = `Here are today's local prayer times:\n\n• ${timesList}`;
            if (next) {
              text += `\n\nNext prayer is ${next.prayer.label} in about ${next.minutesUntil} minutes (${next.prayer.time}).`;
            }
            return {
              sender: 'ai',
              text: text,
              recommendation: {
                dhikrId: 'subahanallah',
                arabic: 'سُبْحَانَ ٱللَّٰهِ',
                transliteration: 'Subhan-Allah',
                translation: 'Glory be to Allah'
              }
            };
          }
        } catch {}
      }
      return {
        sender: 'ai',
        text: "I couldn't find your local prayer times. Please go to the Reminders tab and toggle 'Sync Prayer Times' with location permissions to enable them offline.",
      };
    }

    if (q.includes('forgive') || q.includes('sorry') || q.includes('sin') || q.includes('mistake') || q.includes('repent')) {
      return {
        sender: 'ai',
        text: "Seeking forgiveness cleanses the heart and opens the doors of mercy. Reciting 'Astaghfirullah' helps lift the burden of guilt.",
        recommendation: {
          dhikrId: 'astaghfirullah',
          arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
          transliteration: 'Astaghfirullah',
          translation: 'I seek forgiveness from Allah'
        }
      };
    }
    
    if (q.includes('anxious') || q.includes('worry') || q.includes('scared') || q.includes('fear') || q.includes('stress') || q.includes('sad')) {
      return {
        sender: 'ai',
        text: "Verily, in the remembrance of Allah do hearts find rest. When facing hardships or anxiety, declare Allah's ultimate sovereignty.",
        recommendation: {
          dhikrId: 'la-ilaha-illallah',
          arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
          transliteration: 'La ilaha illallah',
          translation: 'There is no god but Allah'
        }
      };
    }

    if (q.includes('thank') || q.includes('grateful') || q.includes('happy') || q.includes('bless') || q.includes('good')) {
      return {
        sender: 'ai',
        text: "If you are grateful, I will surely increase you. Reciting 'Alhamdulillah' multiplies blessings and anchors joy in gratitude.",
        recommendation: {
          dhikrId: 'alhamdulillah',
          arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
          transliteration: 'Alhamdulillah',
          translation: 'Praise be to Allah'
        }
      };
    }

    // Default fallback
    return {
      sender: 'ai',
      text: "Exalting Allah brings tranquility to the soul. Reciting 'SubhanAllah' praises His infinite perfection above all concerns.",
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
      // Offline fallback & privacy message
      setTimeout(() => {
        const reply = offlineFallback(userText);
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: `🔒 Note: To protect your privacy, Tasbeehly does not store global API keys. To enable the live AI Dhikr Companion, tap the key icon 🔑 in the top-right and paste your secure Google AI Studio API key (saved locally on your device only).\n\nHere is your offline recommendation:\n\n${reply.text}`,
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
                <button
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-muted-foreground/60 hover:text-foreground"
                  title="Configure API Key"
                >
                  <Key size={16} />
                </button>
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
                    className={`max-w-[85%] p-4 rounded-2xl border text-xs leading-relaxed space-y-3 ${
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
