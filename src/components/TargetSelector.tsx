import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
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
          <SheetDescription className="sr-only">
            Set a target count for your dhikr session or select a structured session mode.
          </SheetDescription>
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
                  : 'bg-card border border-border hover:bg-secondary/50'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Tasbih Fatimah</h3>
                    <p className="text-xs text-muted-foreground">Traditional 33-33-34 cycle</p>
                  </div>
                </div>
                {sessionMode.type === 'tasbih100' && (
                  <Check className="text-primary w-5 h-5" />
                )}
              </div>
            </motion.button>

            {/* 1000 Session Mode */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              onClick={handleStart1000Session}
              className={`
                w-full p-4 rounded-2xl text-left
                transition-all duration-200
                ${sessionMode.type === 'tasbih1000'
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-card border border-border hover:bg-secondary/50'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">1000 Salawat</h3>
                    <p className="text-xs text-muted-foreground">Structured long session</p>
                  </div>
                </div>
                {sessionMode.type === 'tasbih1000' && (
                  <Check className="text-primary w-5 h-5" />
                )}
              </div>
            </motion.button>

            <div className="h-px bg-border my-2" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Quick Presets</p>

            <div className="grid grid-cols-2 gap-3">
              {presetTargets.map((preset, index) => (
                <motion.button
                  key={preset.value}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 + 0.1 }}
                  onClick={() => handlePresetSelect(preset.value)}
                  className={`
                    p-4 rounded-2xl text-left transition-all duration-200
                    ${targetCount === preset.value && sessionMode.type === 'free'
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-card border border-border hover:bg-secondary/50'}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-2xl font-light text-foreground">{preset.label}</span>
                    {targetCount === preset.value && sessionMode.type === 'free' && (
                      <Check className="text-primary w-4 h-4" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{preset.description}</p>
                </motion.button>
              ))}
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Custom Goal</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    placeholder="Enter custom count..."
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                    className="rounded-xl border-border bg-card pr-12 h-12"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    goal
                  </div>
                </div>
                <button
                  onClick={handleCustomSubmit}
                  className="px-6 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all active:scale-95"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Session?</AlertDialogTitle>
            <AlertDialogDescription>
              You're currently in a structured session. Changing the target will reset your current progress in this session. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelAction}>Continue Session</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Reset & Change</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
