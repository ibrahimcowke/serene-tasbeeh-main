import { motion } from 'framer-motion';

interface ZikrRingDigitalProps {
    currentCount: number;
}

export function ZikrRingDigital({ currentCount }: ZikrRingDigitalProps) {
    // Looks like a plastic/silicone finger counter ring
    return (
        <div className="relative w-48 h-64 flex items-center justify-center">
            {/* Strap / Ring body */}
            <div className="absolute bottom-0 w-32 h-32 rounded-full border-8 border-neutral-800 bg-transparent translate-y-10 -z-10" />

            {/* Main Device Body */}
            <div className="relative w-32 h-40 bg-neutral-900 rounded-3xl shadow-2xl flex flex-col items-center p-4 border border-neutral-700">
                {/* Screen */}
                <div className="w-full h-16 bg-[#9ea792] rounded-md shadow-inner mb-4 flex items-center justify-end px-2 font-mono text-3xl tracking-widest text-[#2c3e50] bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')]">
                    {currentCount.toString().padStart(5, '0')}
                </div>

                {/* Big Button */}
                <motion.div
                    className="w-20 h-20 rounded-full bg-neutral-800 border-4 border-neutral-700 shadow-[0_5px_0_#262626] flex items-center justify-center active:shadow-none active:translate-y-[5px]"
                    whileTap={{ scale: 0.95, y: 5 }}
                >
                    <div className="w-16 h-16 rounded-full bg-neutral-700/50" />
                </motion.div>

                {/* Reset button tiny */}
                <div className="absolute top-2 right-[-10px] w-4 h-4 rounded-full bg-red-800 shadow-sm" />
            </div>
        </div>
    );
}
