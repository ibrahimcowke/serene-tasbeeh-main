import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Pause, Play, CloudRain, Waves, Building2 } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { ambientEngine } from '@/lib/sound';
import { useTranslation } from '@/lib/i18n';

const AMBIENT_ICONS: Record<string, React.ReactNode> = {
  rain: <CloudRain className="w-4 h-4" />,
  water: <Waves className="w-4 h-4" />,
  masjid: <Building2 className="w-4 h-4" />,
};

const AMBIENT_LABELS: Record<string, string> = {
  rain: '🌧️ Rain',
  water: '💧 Water',
  masjid: '🕌 Masjid',
};

export function AmbientSoundPlayer() {
  const ambientSoundType = useTasbeehStore((s) => s.ambientSoundType);
  const ambientSoundVolume = useTasbeehStore((s) => s.ambientSoundVolume);
  const setAmbientSound = useTasbeehStore((s) => s.setAmbientSound);
  const setAmbientSoundVolume = useTasbeehStore((s) => s.setAmbientSoundVolume);
  const [paused, setPaused] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const { t } = useTranslation();

  // Sync engine with store state
  useEffect(() => {
    if (ambientSoundType === 'none') {
      ambientEngine.stop();
      setPaused(false);
    } else if (!paused) {
      ambientEngine.play(ambientSoundType, ambientSoundVolume);
    }
  }, [ambientSoundType, ambientSoundVolume, paused]);

  const handlePauseToggle = () => {
    if (paused) {
      ambientEngine.play(ambientSoundType as any, ambientSoundVolume);
      setPaused(false);
    } else {
      ambientEngine.stop();
      setPaused(true);
    }
  };

  const handleStop = () => {
    setAmbientSound('none');
    ambientEngine.stop();
    setPaused(false);
  };

  if (ambientSoundType === 'none') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2"
      >
        {/* Volume slider (shown when tapping volume icon) */}
        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="px-4 py-3 rounded-2xl flex flex-col items-center gap-2"
              style={{
                background: 'hsl(var(--card) / 0.95)',
                border: '1px solid hsl(var(--border) / 0.4)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {t('settings.ambient_volume')}
              </span>
              <div className="flex items-center gap-2">
                <VolumeX className="w-3 h-3" style={{ color: 'hsl(var(--muted-foreground))' }} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientSoundVolume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setAmbientSoundVolume(v);
                    ambientEngine.setVolume(v);
                  }}
                  className="w-24 accent-primary"
                />
                <Volume2 className="w-3 h-3" style={{ color: 'hsl(var(--muted-foreground))' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main player pill */}
        <motion.div
          className="flex items-center gap-1 px-3 py-2 rounded-2xl"
          style={{
            background: 'hsl(var(--card) / 0.95)',
            border: '1px solid hsl(var(--primary) / 0.3)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px hsl(var(--primary) / 0.1)',
          }}
        >
          {/* Sound type indicator */}
          <div className="flex items-center gap-1.5 px-2">
            <motion.div
              animate={!paused ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: 'hsl(var(--primary))' }}
            >
              {AMBIENT_ICONS[ambientSoundType]}
            </motion.div>
            <span className="text-xs font-medium" style={{ color: 'hsl(var(--foreground) / 0.8)' }}>
              {AMBIENT_LABELS[ambientSoundType]}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-4" style={{ background: 'hsl(var(--border))' }} />

          {/* Pause/play */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handlePauseToggle}
            className="p-1.5 rounded-xl transition-colors"
            style={{ color: 'hsl(var(--primary))' }}
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </motion.button>

          {/* Volume toggle */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setShowVolume((s) => !s)}
            className="p-1.5 rounded-xl transition-colors"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            <Volume2 className="w-4 h-4" />
          </motion.button>

          {/* Stop */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleStop}
            className="p-1.5 rounded-xl text-xs font-medium transition-colors"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            ✕
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
