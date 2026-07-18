import { useState, useRef } from 'react';
import { Share2, Download, X } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { toast } from 'sonner';

interface DhikrShareCardProps {
  dhikrId: string;
  arabic: string;
  transliteration: string;
  translation: string;
  onClose?: () => void;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function DhikrShareCard({ dhikrId, arabic, transliteration, translation, onClose }: DhikrShareCardProps) {
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const dailyRecords = useTasbeehStore(s => s.dailyRecords);
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = dailyRecords.find(r => r.date === today);
  const todayCount = todayRecord?.counts?.[dhikrId] || 0;

  const handleShare = async () => {
    setSharing(true);
    try {
      // Try html2canvas if available, else fall back to text share
      let shared = false;
      try {
        const html2canvas = (await import('html2canvas')).default;
        if (cardRef.current) {
          const canvas = await html2canvas(cardRef.current, {
            scale: 3,
            backgroundColor: null,
            useCORS: true,
          });
          const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/png'));
          if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'dhikr.png', { type: 'image/png' })] })) {
            await navigator.share({
              title: transliteration,
              text: `${arabic}\n${transliteration}\n"${translation}"\n\nShared from Tasbeehly 📿`,
              files: [new File([blob], 'dhikr.png', { type: 'image/png' })],
            });
            shared = true;
          } else {
            // Desktop: download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${transliteration}-dhikr.png`;
            a.click();
            URL.revokeObjectURL(url);
            shared = true;
          }
        }
      } catch {
        // html2canvas not available — fall back to text share
      }

      if (!shared) {
        const text = `📿 ${arabic}\n${transliteration}\n"${translation}"\n\n✨ Shared from Tasbeehly`;
        if (navigator.share) {
          await navigator.share({ title: transliteration, text });
        } else {
          await navigator.clipboard.writeText(text);
          toast.success('Dhikr copied to clipboard!');
        }
      } else {
        toast.success('Dhikr card shared!');
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') toast.error('Could not share. Try again.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm space-y-3" onClick={e => e.stopPropagation()}>
        {/* Shareable Card */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl p-7 text-center"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)',
            border: '1px solid hsl(var(--border)/0.6)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary)/0.18) 0%, transparent 70%)' }}
          />

          {/* App branding */}
          <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-5">Tasbeehly</p>

          {/* Arabic */}
          <p
            className="text-4xl leading-loose text-primary mb-3"
            style={{ fontFamily: "'Amiri','Traditional Arabic',serif", direction: 'rtl' }}
          >
            {arabic}
          </p>

          {/* Transliteration */}
          <p className="text-base font-bold text-foreground mb-1">{transliteration}</p>

          {/* Translation */}
          <p className="text-xs text-muted-foreground italic mb-5">"{translation}"</p>

          {/* Divider */}
          <div className="w-12 h-px bg-border/50 mx-auto mb-5" />

          {/* Today's count */}
          {todayCount > 0 && (
            <div className="flex items-center justify-center gap-2">
              <div className="text-center">
                <p className="text-2xl font-black text-primary tabular-nums">{formatNumber(todayCount)}</p>
                <p className="text-[9px] text-muted-foreground/50 uppercase tracking-widest">Today's count</p>
              </div>
            </div>
          )}

          {/* Date */}
          <p className="text-[9px] text-muted-foreground/30 mt-4">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-primary/95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Share2 size={14} />
            {sharing ? 'Sharing…' : 'Share'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3.5 rounded-2xl bg-foreground/5 border border-border/20 text-foreground hover:bg-foreground/10 transition-all"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
