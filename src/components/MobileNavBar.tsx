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
  <button
    ref={ref}
    onClick={onClick}
    className="flex flex-col items-center justify-center w-full h-full gap-1 text-sidebar-foreground/40 hover:text-sidebar-foreground/80 active:text-primary transition-colors cursor-pointer bg-transparent border-none outline-none"
  >
    <Icon className="w-5 h-5" />
    <span className="text-[9px] tracking-wider uppercase font-light">{label}</span>
  </button>
));
NavItem.displayName = 'NavItem';

export function MobileNavBar() {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation();

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: 'linear-gradient(to top, hsl(var(--sidebar) / 0.97) 0%, hsl(var(--sidebar) / 0.85) 100%)',
        borderTop: '1px solid hsl(var(--sidebar-border) / 0.5)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex justify-around items-center h-14 px-2">
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
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpenMobile(true)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-sidebar-foreground/40 hover:text-sidebar-foreground/80 transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[9px] tracking-wider uppercase font-light">{t('nav.menu')}</span>
        </motion.button>
      </div>
    </div>
  );
}
