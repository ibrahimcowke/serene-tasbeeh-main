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
    whileTap={{ scale: 0.95 }}
    className={`flex flex-col items-center justify-center w-full h-[46px] gap-0.5 px-2 rounded-xl transition-all duration-200 cursor-pointer bg-transparent border-none outline-none group ${
      isActive
        ? 'bg-gradient-to-br from-[#1b4332] via-[#245842] to-[#2d6a4f] text-white shadow-md shadow-[#1b4332]/25 scale-[1.02]'
        : 'text-primary/70 hover:text-primary hover:bg-primary/10'
    }`}
  >
    <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-amber-300' : 'text-primary/80 group-hover:text-primary'}`} />
    <span className={`text-[9px] tracking-wider uppercase ${isActive ? 'font-extrabold text-white' : 'font-semibold text-primary/80 group-hover:text-primary'}`}>{label}</span>
  </motion.button>
));
NavItem.displayName = 'NavItem';

export function MobileNavBar() {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('dhikr');

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

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveTab('menu');
            setOpenMobile(true);
          }}
          className={`flex flex-col items-center justify-center w-full h-[46px] gap-0.5 px-2 rounded-xl transition-all duration-200 cursor-pointer border-none outline-none group ${
            activeTab === 'menu'
              ? 'bg-gradient-to-br from-[#1b4332] via-[#245842] to-[#2d6a4f] text-white shadow-md shadow-[#1b4332]/25 scale-[1.02]'
              : 'text-primary/70 hover:text-primary hover:bg-primary/10'
          }`}
        >
          <Grid className={`w-4.5 h-4.5 transition-colors ${activeTab === 'menu' ? 'text-amber-300' : 'text-primary/80 group-hover:text-primary'}`} />
          <span className={`text-[9px] tracking-wider uppercase ${activeTab === 'menu' ? 'font-extrabold text-white' : 'font-semibold text-primary/80 group-hover:text-primary'}`}>{t('nav.menu')}</span>
        </motion.button>
      </div>
    </div>
  );
}
