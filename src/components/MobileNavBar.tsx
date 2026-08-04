import { forwardRef, lazy, Suspense, useState } from 'react';
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
  isActive?: boolean;
}>(({ label, icon: Icon, onClick, isActive }, ref) => (
  <motion.button
    ref={ref}
    onClick={onClick}
    whileTap={{ scale: 0.92 }}
    className={`relative flex flex-col items-center justify-center flex-1 h-12 gap-0.5 px-2 rounded-2xl transition-all duration-300 cursor-pointer border-none outline-none group ${
      isActive
        ? 'text-primary font-bold shadow-md shadow-primary/20'
        : 'text-muted-foreground hover:text-foreground'
    }`}
    style={{
      background: isActive ? 'hsl(var(--primary) / 0.15)' : 'transparent',
    }}
  >
    {isActive && (
      <motion.div
        layoutId="activeDockIndicator"
        className="absolute inset-0 rounded-2xl border border-primary/30"
        style={{ background: 'hsl(var(--primary) / 0.12)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    )}
    <Icon className={`w-4.5 h-4.5 z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
    <span className={`text-[9px] tracking-wider uppercase z-10 ${isActive ? 'font-extrabold text-primary' : 'font-medium text-muted-foreground'}`}>{label}</span>
  </motion.button>
));
NavItem.displayName = 'NavItem';

export function MobileNavBar() {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('dhikr');

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-50 pb-safe pointer-events-auto">
      <div
        className="flex justify-around items-center h-15 px-2.5 rounded-3xl border shadow-2xl transition-all"
        style={{
          background: 'hsl(var(--card) / 0.7)',
          borderColor: 'hsl(var(--primary) / 0.25)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 16px 40px -8px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        <Suspense fallback={<NavItem label={t('nav.dhikr')} icon={BookOpen} />}>
          <DhikrSelector>
            <NavItem
              label={t('nav.dhikr')}
              icon={BookOpen}
              isActive={activeTab === 'dhikr'}
              onClick={() => setActiveTab('dhikr')}
            />
          </DhikrSelector>
        </Suspense>

        <Suspense fallback={<NavItem label={t('nav.target')} icon={Target} />}>
          <TargetSelector>
            <NavItem
              label={t('nav.target')}
              icon={Target}
              isActive={activeTab === 'target'}
              onClick={() => setActiveTab('target')}
            />
          </TargetSelector>
        </Suspense>

        <Suspense fallback={<NavItem label={t('nav.reminders')} icon={Bell} />}>
          <RemindersView>
            <NavItem
              label={t('nav.reminders')}
              icon={Bell}
              isActive={activeTab === 'reminders'}
              onClick={() => setActiveTab('reminders')}
            />
          </RemindersView>
        </Suspense>

        <Suspense fallback={<NavItem label={t('nav.qibla')} icon={Compass} />}>
          <QiblaCompass>
            <NavItem
              label={t('nav.qibla')}
              icon={Compass}
              isActive={activeTab === 'qibla'}
              onClick={() => setActiveTab('qibla')}
            />
          </QiblaCompass>
        </Suspense>

        <NavItem
          label={t('nav.menu')}
          icon={Grid}
          isActive={activeTab === 'menu'}
          onClick={() => {
            setActiveTab('menu');
            setOpenMobile(true);
          }}
        />
      </div>
    </div>
  );
}
