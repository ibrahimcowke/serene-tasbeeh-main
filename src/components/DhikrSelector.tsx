import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2, Search, Heart } from 'lucide-react';
import { useTasbeehStore, Dhikr } from '@/store/tasbeehStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
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
  const { dhikrs, customDhikrs, currentDhikr, setDhikr, addCustomDhikr, removeCustomDhikr, sessionMode, favoriteDhikrIds, toggleFavorite } = useTasbeehStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');

  const allDhikrs = [...dhikrs, ...customDhikrs].filter(d => {
    const matchesSearch = d.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.arabic.includes(searchQuery);
    const matchesFilter = filterMode === 'all' || favoriteDhikrIds.includes(d.id);
    return matchesSearch && matchesFilter;
  });

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

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[80vh]">
        <SheetDescription className="sr-only">
          Select or search for a specific dhikr to recite. You can also add your own custom dhikr.
        </SheetDescription>
        <div className="sheet-handle" />
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-lg font-medium">Select Dhikr</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-1 mb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dhikr..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary border-none focus:ring-1 focus:ring-primary/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterMode === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterMode === 'favorites' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              <Heart className={`w-3 h-3 ${filterMode === 'favorites' ? 'fill-current' : ''}`} />
              Favorites
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-safe custom-scrollbar pr-1">
          <div className="grid grid-cols-1 gap-2 mb-6">
            {allDhikrs.map((dhikr) => (
              <motion.div
                key={dhikr.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(dhikr)}
                className={`
                  relative p-4 rounded-2xl flex items-center justify-between group transition-all
                  ${currentDhikr.id === dhikr.id ? 'bg-primary/10 ring-1 ring-primary/20' : 'bg-card hover:bg-secondary/50'}
                `}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-foreground">{dhikr.transliteration}</h3>
                    {favoriteDhikrIds.includes(dhikr.id) && (
                      <Heart className="w-3 h-3 text-primary fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">{dhikr.meaning}</p>
                </div>

                <div className="flex items-center gap-2 pl-4">
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-2xl font-arabic text-primary leading-none">{dhikr.arabic}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleToggleFavorite(dhikr.id, e)}
                        className="p-2 rounded-full hover:bg-primary/5 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${favoriteDhikrIds.includes(dhikr.id) ? 'text-primary fill-current' : 'text-muted-foreground'}`} />
                      </button>
                      {'isCustom' in dhikr && (
                        <button
                          onClick={(e) => handleDeleteCustom(dhikr.id, e)}
                          className="p-2 rounded-full hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {currentDhikr.id === dhikr.id && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full p-6 rounded-2xl border-2 border-dashed border-primary/20 text-primary flex flex-col items-center gap-2 hover:bg-primary/5 transition-all"
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm font-medium">Add Custom Dhikr</span>
              </button>
            )}

            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-card border border-primary/20 space-y-4"
              >
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Arabic</label>
                    <input
                      value={newDhikr.arabic}
                      onChange={(e) => setNewDhikr({ ...newDhikr, arabic: e.target.value })}
                      placeholder="e.g., سبحان الله"
                      dir="rtl"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary border-none font-arabic text-xl"
                    />
                    {errors.arabic && <p className="text-[10px] text-destructive">{errors.arabic}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Transliteration</label>
                    <input
                      value={newDhikr.transliteration}
                      onChange={(e) => setNewDhikr({ ...newDhikr, transliteration: e.target.value })}
                      placeholder="e.g., SubhanAllah"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary border-none text-sm"
                    />
                    {errors.transliteration && <p className="text-[10px] text-destructive">{errors.transliteration}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Meaning</label>
                    <input
                      value={newDhikr.meaning}
                      onChange={(e) => setNewDhikr({ ...newDhikr, meaning: e.target.value })}
                      placeholder="e.g., Glory be to Allah"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary border-none text-sm"
                    />
                    {errors.meaning && <p className="text-[10px] text-destructive">{errors.meaning}</p>}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAddCustom}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setErrors({});
                    }}
                    className="flex-1 py-2.5 bg-secondary text-foreground rounded-xl font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
