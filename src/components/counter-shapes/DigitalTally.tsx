import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { toast } from 'sonner';

interface DigitalTallyProps {
  currentCount: number;
}

export function DigitalTally({ currentCount }: DigitalTallyProps) {
  const increment = useTasbeehStore(state => state.increment);
  const reset = useTasbeehStore(state => state.reset);
  
  // LED backlight state
  const [ledActive, setLedActive] = useState(false);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering tap count
    if (window.confirm('Reset counter?')) {
      reset();
      toast.success('Counter reset');
    }
  };

  const handleLedToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering tap count
    setLedActive(true);
    setTimeout(() => {
      setLedActive(false);
    }, 4000); // backlight stays on for 4 seconds
  };

  // Format count to 5 digits, e.g. 00600
  const formattedCount = String(currentCount).padStart(5, '0').slice(-5);

  return (
    <div 
      onClick={() => increment()}
      className="flex items-center justify-center w-64 h-72 relative cursor-pointer select-none active:scale-[0.99] transition-transform"
    >
      {/* Outer ergonomic pink casing */}
      <div 
        className="w-56 h-68 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 rounded-[55px_55px_80px_80px] shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.3)] flex flex-col items-center p-3 relative border-b-[6px] border-pink-600"
        style={{
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.5), inset 0 -4px 6px rgba(0,0,0,0.2)'
        }}
      >
        {/* Inner black faceplate */}
        <div className="w-full h-full bg-zinc-950 rounded-[45px_45px_70px_70px] border border-zinc-800 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] flex flex-col items-center pt-3 px-3 relative">
          
          {/* Top Brand Text */}
          <span className="text-[10px] font-sans font-bold text-zinc-500 tracking-[0.2em] mb-1">
            JXN 5136
          </span>

          {/* LCD Screen Display */}
          <div 
            className={`w-[85%] h-14 rounded-lg border-2 border-zinc-700 shadow-[inset_0_3px_6px_rgba(0,0,0,0.6)] flex items-center justify-between px-3 relative overflow-hidden transition-all duration-300 ${
              ledActive 
                ? 'bg-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.6)]' 
                : 'bg-[#a3b19b]'
            }`}
          >
            {/* Gloss shine reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/5 to-transparent z-10 pointer-events-none" />

            {/* LCD digit slots (faded background segments) */}
            <div className="absolute inset-x-3 flex justify-between select-none opacity-[0.08] font-mono text-3xl tracking-widest text-black">
              88888
            </div>

            {/* Actual count value */}
            <div className="w-full flex justify-end font-mono text-3xl tracking-widest font-bold z-10 transition-all duration-200"
              style={{
                color: ledActive ? '#052d30' : '#1d221a',
                textShadow: ledActive ? '0 0 1px rgba(5,45,48,0.5)' : 'none'
              }}
            >
              {formattedCount}
            </div>
          </div>

          {/* Reset / Logo / LED row */}
          <div className="w-full flex justify-between items-center px-4 mt-3 z-10">
            {/* Reset Button container */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-wider">Reset</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleReset}
                className="w-5 h-5 rounded-full bg-gradient-to-b from-pink-300 to-pink-500 shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-pink-400 cursor-pointer active:shadow-inner"
              />
            </div>

            {/* Middle logo logo */}
            <div className="flex flex-col items-center opacity-40">
              <div className="text-[8px] font-black text-zinc-500 tracking-tighter">100</div>
              <svg className="w-4 h-3 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 12v0a8 8 0 0 1 8-8v0a8 8 0 0 1 8 8" />
                <path d="M8 12v0a4 4 0 0 1 4-4v0a4 4 0 0 1 4 4" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
              </svg>
            </div>

            {/* LED Button container */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-wider">LED</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLedToggle}
                className="w-5 h-5 rounded-full bg-gradient-to-b from-pink-300 to-pink-500 shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-pink-400 cursor-pointer active:shadow-inner"
              />
            </div>
          </div>

          {/* Large COUNT Tapper Button */}
          <div className="flex-1 flex flex-col items-center justify-center mb-1 mt-2 z-10">
            <motion.div
              whileTap={{ scale: 0.93, y: 1 }}
              className="w-20 h-20 rounded-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 shadow-[0_6px_12px_rgba(0,0,0,0.6),inset_0_2px_3px_rgba(255,255,255,0.6),inset_0_-3px_5px_rgba(0,0,0,0.3)] border-b-4 border-pink-600 flex items-center justify-center cursor-pointer"
            >
              {/* Button inner contour */}
              <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-b from-pink-400 to-pink-500 shadow-inner" />
            </motion.div>
            <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-black mt-1">
              Count
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
