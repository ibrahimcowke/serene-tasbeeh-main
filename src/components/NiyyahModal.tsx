import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, BookOpen, Heart, User } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';

interface NiyyahModalProps {
  open: boolean;
  onClose: () => void;
}

export function NiyyahModal({ open, onClose }: NiyyahModalProps) {
  const { t } = useTranslation();
  const niyyah = useTasbeehStore((s) => s.niyyah);
  const setNiyyah = useTasbeehStore((s) => s.setNiyyah);
  const presets = useTasbeehStore((s) => s.niyyahPresets) || [];

  const [text, setText] = useState(niyyah);
  const [dedicatedTo, setDedicatedTo] = useState('');

  const handleSave = () => {
    setNiyyah(text);
    if (dedicatedTo.trim()) {
      // Save dedicated name/purpose in store state if needed or show a toast
      toast.success(`Niyyah set: Reciting for "${dedicatedTo.trim()}"`);
    } else {
      toast.success('Intention (Niyyah) updated successfully.');
    }
    onClose();
  };

  const handleSelectPreset = (preset: string) => {
    setText(preset);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-border/40 shadow-2xl z-10"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--card) / 0.9) 0%, hsl(var(--card) / 0.75) 100%)',
              backdropFilter: 'blur(30px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/10">
              <div className="flex items-center gap-2 text-primary">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-sm font-bold uppercase tracking-wider">Set Intention (Niyyah)</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-muted-foreground/60 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Actions are judged by intentions. Setting a Niyyah before reciting helps bring focus and spiritual mindfulness.
              </p>

              {/* Text Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider flex items-center gap-1">
                  <span>Custom Intention</span>
                </label>
                <textarea
                  className="w-full h-20 px-3.5 py-2.5 rounded-2xl bg-foreground/5 border border-border/20 text-sm focus:outline-none focus:border-primary/50 text-foreground resize-none"
                  placeholder="E.g., Seeking Allah's pleasure, recovery from illness, relief from hardships..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              {/* Dedicated field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3 text-primary" />
                  <span>Dedicate to (Optional)</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2 rounded-2xl bg-foreground/5 border border-border/20 text-sm focus:outline-none focus:border-primary/50 text-foreground"
                  placeholder="E.g., Mother, Father, My Children, Self..."
                  value={dedicatedTo}
                  onChange={(e) => setDedicatedTo(e.target.value)}
                />
              </div>

              {/* Presets List */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider">Presets</label>
                <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
                  {presets.map((preset) => {
                    const isSelected = text === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => handleSelectPreset(preset)}
                        className="text-left px-4 py-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 text-foreground/80 hover:bg-foreground/5"
                        style={{
                          background: isSelected ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          borderColor: isSelected ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--border) / 0.3)'
                        }}
                      >
                        <span className="leading-normal">{preset}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold bg-white/5 border border-border/15 hover:bg-white/10 text-foreground transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer text-center shadow-lg"
                >
                  Save Intention
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
