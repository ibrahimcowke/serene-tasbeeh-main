import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2, Search } from 'lucide-react';
import { useTasbeehStore, Dhikr } from '@/store/tasbeehStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

interface DhikrSelectorProps {
  children: React.ReactNode;
}

const customDhikrSchema = z.object({
  arabic: z.string().trim().min(1, 'Arabic text is required').max(100, 'Too long'),
  transliteration: z.string().trim().min(1, 'Transliteration is required').max(100, 'Too long'),
  meaning: z.string().trim().min(1, 'Meaning is required').max(200, 'Too long'),
});

export function DhikrSelector({ children }: DhikrSelectorProps) {
  const { dhikrs, customDhikrs, currentDhikr, setDhikr, addCustomDhikr, removeCustomDhikr, sessionMode } = useTasbeehStore();
  const [searchQuery, setSearchQuery] = useState('');

  const allDhikrs = [...dhikrs, ...customDhikrs].filter(d =>
    d.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.arabic.includes(searchQuery)
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDhikr, setNewDhikr] = useState({ arabic: '', transliteration: '', meaning: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelect = (dhikr: Dhikr) => {
    if (sessionMode.type === 'tasbih100') return; // Can't change dhikr during 100 session
    setDhikr(dhikr);
  };

  const handleAddCustom = () => {
    const result = customDhikrSchema.safeParse(newDhikr);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    addCustomDhikr({
      arabic: result.data.arabic,
      transliteration: result.data.transliteration,
      meaning: result.data.meaning,
    });
    setNewDhikr({ arabic: '', transliteration: '', meaning: '' });
    setErrors({});
    setShowAddForm(false);
  };

  const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeCustomDhikr(id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[80vh]">
        <div className="sheet-handle" />
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-lg font-medium">Select Dhikr</SheetTitle>
        </SheetHeader>

        <div className="flex items-center gap-2 px-1 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dhikr..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary border-none focus:ring-1 focus:ring-primary/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto pb-8 max-h-[calc(80vh-160px)]">
          {/* Dhikr list */}
          {allDhikrs.map((dhikr, index) => {
            const isCustom = dhikr.id.startsWith('custom_');
            const isDisabled = sessionMode.type === 'tasbih100';

            return (
              <motion.button
                key={dhikr.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleSelect(dhikr)}
                disabled={isDisabled}
                className={`
                  w-full p-4 rounded-2xl text-left relative
                  transition-colors duration-200
                  ${currentDhikr.id === dhikr.id
                    ? 'bg-accent border border-primary/20'
                    : 'bg-card hover:bg-secondary'
                  }
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-arabic text-xl text-foreground mb-1">
                      {dhikr.arabic}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {dhikr.transliteration}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {dhikr.meaning}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustom(dhikr.id, e)}
                        className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
                        aria-label="Delete custom dhikr"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    )}
                    {currentDhikr.id === dhikr.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Add custom dhikr */}
          {!showAddForm ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAddForm(true)}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/30 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-5 h-5" />
              <span>Add custom dhikr</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-card space-y-4"
            >
              <p className="text-sm font-medium text-foreground">Add Custom Dhikr</p>

              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="Arabic text (e.g., سُبْحَانَ اللهِ)"
                    value={newDhikr.arabic}
                    onChange={(e) => setNewDhikr({ ...newDhikr, arabic: e.target.value })}
                    className="font-arabic text-lg h-12 rounded-xl bg-background"
                    dir="rtl"
                  />
                  {errors.arabic && <p className="text-xs text-destructive mt-1">{errors.arabic}</p>}
                </div>

                <div>
                  <Input
                    placeholder="Transliteration (e.g., SubhanAllah)"
                    value={newDhikr.transliteration}
                    onChange={(e) => setNewDhikr({ ...newDhikr, transliteration: e.target.value })}
                    className="h-12 rounded-xl bg-background"
                  />
                  {errors.transliteration && <p className="text-xs text-destructive mt-1">{errors.transliteration}</p>}
                </div>

                <div>
                  <Input
                    placeholder="Meaning (e.g., Glory be to Allah)"
                    value={newDhikr.meaning}
                    onChange={(e) => setNewDhikr({ ...newDhikr, meaning: e.target.value })}
                    className="h-12 rounded-xl bg-background"
                  />
                  {errors.meaning && <p className="text-xs text-destructive mt-1">{errors.meaning}</p>}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewDhikr({ arabic: '', transliteration: '', meaning: '' });
                    setErrors({});
                  }}
                  className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustom}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}

          {sessionMode.type === 'tasbih100' && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              Dhikr selection is disabled during 100 session mode
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
