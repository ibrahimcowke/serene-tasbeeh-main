import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TargetSelectorProps {
  children: React.ReactNode;
}

const presetTargets = [
  { value: 33, label: '33', description: 'One set' },
  { value: 99, label: '99', description: 'Names of Allah' },
  { value: 100, label: '100', description: 'Standard round' },
  { value: 500, label: '500', description: 'Long session' },
  { value: 1000, label: '1000', description: 'Extended session' },
  { value: 0, label: '∞', description: 'No limit' },
];

export function TargetSelector({ children }: TargetSelectorProps) {
  const { targetCount, setTarget, startTasbih100, startTasbih1000, sessionMode } = useTasbeehStore();
  const [customValue, setCustomValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const handleAction = (action: () => void) => {
    // Check if we are in a structured session and it is NOT complete
    if (sessionMode.type !== 'free' && !sessionMode.isComplete) {
      setPendingAction(() => action);
      setShowWarning(true);
    } else {
      action();
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowWarning(false);
  };

  const cancelAction = () => {
    setPendingAction(null);
    setShowWarning(false);
  };

  const handlePresetSelect = (value: number) => {
    handleAction(() => {
      setTarget(value);
      setIsOpen(false);
    });
  };

  const handleCustomSubmit = () => {
    const value = parseInt(customValue);
    if (value > 0 && value <= 99999) {
      handleAction(() => {
        setTarget(value);
        setCustomValue('');
        setIsOpen(false);
      });
    }
  };

  const handleStart100Session = () => {
    handleAction(() => {
      startTasbih100();
      setIsOpen(false);
    });
  };

  const handleStart1000Session = () => {
    handleAction(() => {
      startTasbih1000();
      setIsOpen(false);
    });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl">
          <div className="sheet-handle" />
          <SheetHeader className="text-left pb-4">
            <SheetTitle className="text-lg font-medium">Set Target</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 pb-8">
            {/* 100 Session Mode */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleStart100Session}
              className={`
                w-full p-4 rounded-2xl text-left
                transition-all duration-200
                ${sessionMode.type === 'tasbih100'
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-gradient-to-r from-primary/5 to-accent/50 border border-primary/20 hover:border-primary/40'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-foreground">100 Session</p>
                    <p className="text-xs text-muted-foreground">33+33+33+1 with auto-progression</p>
                  </div>
                </div>
                {sessionMode.type === 'tasbih100' && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-1">
                {['سُبْحَانَ اللهِ', 'الْحَمْدُ لِلَّهِ', 'اللهُ أَكْبَرُ', 'لَا إِلَٰهَ إِلَّا اللهُ'].map((text, i) => (
                  <span
                    key={i}
                    className="flex-1 text-center py-1 px-1 rounded-lg bg-background/50 text-xs font-arabic text-muted-foreground"
                  >
                    {i === 3 ? '×1' : '×33'}
                  </span>
                ))}
              </div>
            </motion.button>

            {/* 1000 Session Mode */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleStart1000Session}
              className={`
                w-full p-4 rounded-2xl text-left mt-3
                transition-all duration-200
                ${sessionMode.type === 'tasbih1000'
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-gradient-to-r from-primary/5 to-accent/50 border border-primary/20 hover:border-primary/40'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-foreground">1000 Session</p>
                    <p className="text-xs text-muted-foreground">General Dhikr • Auto-progression</p>
                  </div>
                </div>
                {sessionMode.type === 'tasbih1000' && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-1">
                <span
                  className="w-full text-center py-1 px-1 rounded-lg bg-background/50 text-xs text-muted-foreground"
                >
                  10 Sets of 100 Counts
                </span>
              </div>
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-sheet-bg px-3 text-xs text-muted-foreground">or set custom target</span>
              </div>
            </div>

            {/* Preset targets */}
            <div className="grid grid-cols-2 gap-3">
              {presetTargets.map((preset, index) => (
                <motion.button
                  key={preset.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePresetSelect(preset.value)}
                  className={`
                    p-4 rounded-2xl text-left
                    transition-colors duration-200
                    ${targetCount === preset.value && sessionMode.type === 'free'
                      ? 'bg-accent border border-primary/20'
                      : 'bg-card hover:bg-secondary'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-light text-foreground">
                        {preset.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {preset.description}
                      </p>
                    </div>
                    {targetCount === preset.value && sessionMode.type === 'free' && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Custom target */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-3">Custom target</p>
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="Enter number"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="flex-1 h-12 rounded-xl bg-card border-border"
                  min={1}
                  max={99999}
                />
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customValue || parseInt(customValue) <= 0 || parseInt(customValue) > 99999}
                  className="px-6 h-12 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  Set
                </button>
              </div>
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Current Session?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an active session in progress. Switching targets/modes will reset your current progress. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelAction}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
