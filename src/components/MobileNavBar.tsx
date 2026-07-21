import { forwardRef, lazy, Suspense } from 'react';
import { BookOpen, Target, Bell, Grid, Compass } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

const DhikrSelector = lazy(() => import("./DhikrSelector").then(m => ({ default: m.DhikrSelector })));
const TargetSelector = lazy(() => import("./TargetSelector").then(m => ({ default: m.TargetSelector })));
const RemindersView = lazy(() => import("./RemindersView").then(m => ({ default: m.RemindersView })));
const QiblaCompass = lazy(() => import("./QiblaCompass").then(m => ({ default: m.QiblaCompass })));

// forwardRef so Radix UI dialogs (DhikrSelector, TargetSelector, RemindersView) can attach their ref
const NavItem = forwardRef<HTMLButtonElement, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}>(({ label, icon: Icon, onClick }, ref) => (
  <motion.button
    ref={ref}
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary cursor-pointer bg-transparent border-none outline-none group"
  >
    <Icon className="w-5 h-5 text-primary/90 group-hover:text-primary transition-colors" />
    <span className="text-[9px] tracking-wider uppercase font-semibold text-primary/80 group-hover:text-primary transition-colors">{label}</span>
  </motion.button>
));
NavItem.displayName = 'NavItem';

export function MobileNavBar() {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation();

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: 'hsl(var(--card) / 0.95)',
        borderTop: '1px solid hsl(var(--primary) / 0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex justify-around items-center h-14 px-2">
        <Suspense fallback={<NavItem label={t('nav.dhikr')} icon={BookOpen} />}>
          <DhikrSelector>
            <NavItem label={t('nav.dhikr')} icon={BookOpen} />
          </DhikrSelector>
        </Suspense>

        <Suspense fallback={<NavItem label={t('nav.target')} icon={Target} />}>
          <TargetSelector>
            <NavItem label={t('nav.target')} icon={Target} />
          </TargetSelector>
        </Suspense>

        <Suspense fallback={<NavItem label={t('nav.reminders')} icon={Bell} />}>
          <RemindersView>
            <NavItem label={t('nav.reminders')} icon={Bell} />
          </RemindersView>
        </Suspense>

        <Suspense fallback={<NavItem label={t('nav.qibla')} icon={Compass} />}>
          <QiblaCompass>
            <NavItem label={t('nav.qibla')} icon={Compass} />
          </QiblaCompass>
        </Suspense>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpenMobile(true)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary group"
        >
          <Grid className="w-5 h-5 text-primary/90 group-hover:text-primary transition-colors" />
          <span className="text-[9px] tracking-wider uppercase font-semibold text-primary/80 group-hover:text-primary transition-colors">{t('nav.menu')}</span>
        </motion.button>
      </div>
    </div>
  );
}
