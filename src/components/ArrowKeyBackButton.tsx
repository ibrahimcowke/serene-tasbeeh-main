import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';

interface ArrowKeyBackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export function ArrowKeyBackButton({ to = '/', label, className = '' }: ArrowKeyBackButtonProps) {
  const navigate = useNavigate();
  const { isRTL, t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when focused on input fields
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.contentEditable === 'true')
      ) {
        return;
      }

      // Check key based on directionality
      const backKey = isRTL ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === backKey) {
        e.preventDefault();
        navigate(to);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, to, isRTL]);

  const Icon = isRTL ? ArrowRight : ArrowLeft;
  const keyHint = isRTL ? '→' : '←';
  const displayLabel = label || (to === '/' ? (isRTL ? 'الرئيسية' : 'Dashboard') : (isRTL ? 'رجوع' : 'Back'));

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97, y: 1 }}
      onClick={() => navigate(to)}
      className={`relative flex items-center gap-3 px-5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide border cursor-pointer select-none group transition-all duration-200 ${className}`}
      style={{
        background: "linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--primary) / 0.03) 100%)",
        borderColor: "hsl(var(--primary) / 0.25)",
        // Tactile keycap shadow + overlay shadow
        boxShadow: "0 4px 0 hsl(var(--primary) / 0.25), 0 8px 16px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.1)",
        color: "hsl(var(--primary))",
        backdropFilter: "blur(12px)",
      }}
    >
      <Icon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
      
      <span>{displayLabel}</span>

      {/* Tactile Keycap Legend */}
      <span 
        className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded bg-primary/10 border border-primary/20 text-[9px] font-mono leading-none font-bold text-primary/70 shadow-sm"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 1.5px 0 rgba(0,0,0,0.1)"
        }}
      >
        {keyHint}
      </span>
    </motion.button>
  );
}
