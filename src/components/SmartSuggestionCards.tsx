import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Check } from 'lucide-react';
import type { SmartSuggestion } from '@/lib/smartReminders';

interface SmartSuggestionCardsProps {
  suggestions: SmartSuggestion[];
  onAdd: (suggestion: SmartSuggestion) => void;
}

export function SmartSuggestionCards({ suggestions, onAdd }: SmartSuggestionCardsProps) {
  const [addedTimes, setAddedTimes] = useState<Set<string>>(new Set());

  if (suggestions.length === 0) return null;

  const handleAdd = (suggestion: SmartSuggestion) => {
    onAdd(suggestion);
    setAddedTimes((prev) => new Set([...prev, suggestion.time]));
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'hsl(var(--primary) / 0.15)' }}
        >
          <Sparkles size={13} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Smart Suggestions</p>
          <p className="text-[10px] text-muted-foreground">Based on your activity patterns</p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {suggestions.map((s, i) => {
          const added = addedTimes.has(s.time);
          return (
            <motion.div
              key={s.time}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex-shrink-0 rounded-2xl p-3 w-40 relative overflow-hidden"
              style={{
                background: added
                  ? 'hsl(var(--primary) / 0.08)'
                  : 'hsl(var(--card) / 0.7)',
                border: added
                  ? '1px solid hsl(var(--primary) / 0.35)'
                  : '1px solid hsl(var(--border) / 0.5)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Confidence glow */}
              {!added && (
                <div
                  className="absolute top-0 right-0 w-12 h-12 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background: 'hsl(var(--primary))',
                    filter: 'blur(16px)',
                    transform: 'translate(30%, -30%)',
                  }}
                />
              )}

              {/* Time */}
              <p className="text-xl font-bold text-foreground tabular-nums leading-none mb-1">
                {s.time}
              </p>

              {/* Label */}
              <p className="text-[11px] font-medium text-foreground/80 leading-tight mb-1">
                {s.label}
              </p>

              {/* Reason */}
              <p className="text-[10px] text-muted-foreground leading-tight mb-3">
                {s.reason}
              </p>

              {/* Confidence bar */}
              <div
                className="h-0.5 rounded-full mb-3 overflow-hidden"
                style={{ background: 'hsl(var(--border) / 0.4)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(s.confidence * 100)}%`,
                    background: 'hsl(var(--primary))',
                  }}
                />
              </div>

              {/* Add button */}
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.div
                    key="added"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 text-[11px] font-semibold"
                    style={{ color: 'hsl(var(--primary))' }}
                  >
                    <Check size={12} />
                    Added
                  </motion.div>
                ) : (
                  <motion.button
                    key="add"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAdd(s)}
                    className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg w-full justify-center"
                    style={{
                      background: 'hsl(var(--primary) / 0.12)',
                      color: 'hsl(var(--primary))',
                      border: '1px solid hsl(var(--primary) / 0.2)',
                    }}
                  >
                    <Plus size={11} />
                    Add Reminder
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
