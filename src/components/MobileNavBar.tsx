import { forwardRef } from 'react';
import { BookOpen, Target, Bell, Grid, Compass } from "lucide-react";
import { DhikrSelector } from "./DhikrSelector";
import { TargetSelector } from "./TargetSelector";
import { RemindersView } from "./RemindersView";
import { QiblaCompass } from "./QiblaCompass";
import { useSidebar } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

// forwardRef so Radix UI dialogs (DhikrSelector, TargetSelector, RemindersView) can attach their ref
const NavItem = forwardRef<HTMLButtonElement, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}>(({ label, icon: Icon, onClick }, ref) => (
  <motion.button
    ref={ref}
    onClick={onClick}
    whileTap={{ scale: 0.93 }}
    className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground/70 hover:text-primary active:text-primary transition-all duration-200 cursor-pointer bg-transparent border-none outline-none group"
  >
    <div className="p-2 rounded-xl group-hover:bg-primary/10 group-active:bg-primary/20 transition-all duration-300">
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-foreground/80 group-hover:text-primary group-active:text-primary" />
    </div>
    <span className="text-[9px] tracking-wider uppercase font-semibold opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all">{label}</span>
  </motion.button>
));
NavItem.displayName = 'NavItem';

export function MobileNavBar() {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation();

  return (
    <div
      className="lg:hidden fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto rounded-[2rem] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--card) / 0.85) 0%, hsl(var(--card) / 0.65) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex justify-around items-center h-16 px-3">
        <DhikrSelector>
          <NavItem label={t('nav.dhikr')} icon={BookOpen} />
        </DhikrSelector>

        <TargetSelector>
          <NavItem label={t('nav.target')} icon={Target} />
        </TargetSelector>

        <RemindersView>
          <NavItem label={t('nav.reminders')} icon={Bell} />
        </RemindersView>

        <QiblaCompass>
          <NavItem label={t('nav.qibla')} icon={Compass} />
        </QiblaCompass>

        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => setOpenMobile(true)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground/70 hover:text-primary transition-all duration-200 group"
        >
          <div className="p-2 rounded-xl group-hover:bg-primary/10 group-active:bg-primary/20 transition-all duration-300">
            <Grid className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-foreground/80 group-hover:text-primary group-active:text-primary" />
          </div>
          <span className="text-[9px] tracking-wider uppercase font-semibold opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all">{t('nav.menu')}</span>
        </motion.button>
      </div>
    </div>
  );
}
