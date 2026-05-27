import { forwardRef } from 'react';
import { BookOpen, Target, Bell, Grid } from "lucide-react";
import { DhikrSelector } from "./DhikrSelector";
import { TargetSelector } from "./TargetSelector";
import { RemindersView } from "./RemindersView";
import { useSidebar } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

// forwardRef so Radix UI dialogs (DhikrSelector, TargetSelector, RemindersView) can attach their ref
const NavItem = forwardRef<HTMLButtonElement, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}>(({ label, icon: Icon, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className="flex flex-col items-center justify-center w-full h-full gap-1 text-amber-300/40 hover:text-amber-300/80 active:text-amber-300 transition-colors cursor-pointer bg-transparent border-none outline-none"
  >
    <Icon className="w-5 h-5" />
    <span className="text-[9px] tracking-wider uppercase font-light">{label}</span>
  </button>
));
NavItem.displayName = 'NavItem';

export function MobileNavBar() {
  const { setOpenMobile } = useSidebar();

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: 'linear-gradient(to top, rgba(8,7,0,0.97) 0%, rgba(10,8,0,0.85) 100%)',
        borderTop: '1px solid rgba(217,119,6,0.1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex justify-around items-center h-14 px-2">
        <DhikrSelector>
          <NavItem label="Dhikr" icon={BookOpen} />
        </DhikrSelector>

        <TargetSelector>
          <NavItem label="Target" icon={Target} />
        </TargetSelector>

        <RemindersView>
          <NavItem label="Reminders" icon={Bell} />
        </RemindersView>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpenMobile(true)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-amber-300/40 hover:text-amber-300/80 transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[9px] tracking-wider uppercase font-light">Menu</span>
        </motion.button>
      </div>
    </div>
  );
}
