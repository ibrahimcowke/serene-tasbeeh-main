import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';

interface NiyyahModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function NiyyahModal({ open, onClose, onConfirm }: NiyyahModalProps) {
  const niyyah = useTasbeehStore((s) => s.niyyah);
  const setNiyyah = useTasbeehStore((s) => s.setNiyyah);
  const { t, isRTL } = useTranslation();
  const [localText, setLocalText] = useState(niyyah);

  const handleConfirm = () => {
    setNiyyah(localText.trim());
    onConfirm();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-6 pt-4 pb-10"
            dir={isRTL ? 'rtl' : 'ltr'}
            style={{
              background: 'linear-gradient(to bottom, hsl(var(--sheet-bg, var(--card))) 0%, hsl(var(--background)) 100%)',
              border: '1px solid hsl(var(--border) / 0.3)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(var(--primary) / 0.12)', border: '1px solid hsl(var(--primary) / 0.25)' }}
                >
                  <Heart className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{t('niyyah.title')}</h3>
                  <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {t('niyyah.subtitle')}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Arabic dua suggestion */}
            <div
              className="rounded-xl px-4 py-3 mb-4 text-center"
              style={{ background: 'hsl(var(--primary) / 0.06)', border: '1px solid hsl(var(--primary) / 0.15)' }}
            >
              <p
                className="text-xl leading-loose"
                style={{
                  fontFamily: "'Amiri', 'Traditional Arabic', serif",
                  color: 'hsl(var(--primary))',
                  direction: 'rtl',
                }}
              >
                نَوَيْتُ أَنْ أَذْكُرَ ٱللَّهَ تَعَالَىٰ
              </p>
              <p className="text-xs mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                "I intend to remember Allah, the Exalted"
              </p>
            </div>

            {/* Text input */}
            <div className="mb-5">
              <textarea
                value={localText}
                onChange={(e) => setLocalText(e.target.value)}
                placeholder={t('niyyah.placeholder')}
                rows={3}
                dir="auto"
                className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: 'hsl(var(--card) / 0.5)',
                  border: '1px solid hsl(var(--border) / 0.5)',
                  color: 'hsl(var(--foreground))',
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: 'hsl(var(--card) / 0.5)',
                  border: '1px solid hsl(var(--border) / 0.4)',
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                {t('niyyah.skip')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleConfirm}
                className="flex-[2] py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))',
                  color: 'hsl(var(--primary-foreground))',
                  boxShadow: '0 4px 20px hsl(var(--primary) / 0.3)',
                }}
              >
                {t('niyyah.confirm')}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
