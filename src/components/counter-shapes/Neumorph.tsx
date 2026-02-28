import { motion } from 'framer-motion';

interface NeumorphProps {
    currentCount: number;
}

export function Neumorph({ currentCount }: NeumorphProps) {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center -z-10">
            {/* Neumorphic Base Base */}
            <div className="relative w-64 h-64 bg-[#e0e5ec] rounded-full shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] flex items-center justify-center">

                {/* Secondary Pushed-in Layer */}
                <div className="w-[85%] h-[85%] bg-[#e0e5ec] rounded-full shadow-[inset_10px_10px_20px_#bebebe,inset_-10px_-10px_20px_#ffffff] flex items-center justify-center">

                    {/* Inner Pushed-out Display Panel */}
                    <motion.div
                        className="w-[60%] h-[60%] bg-[#e0e5ec] rounded-[40px] shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff] flex flex-col items-center justify-center"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            key={currentCount}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-sans font-bold text-zinc-600/80"
                        >
                            {currentCount}
                        </motion.div>
                        <div className="w-12 h-1 bg-zinc-300 rounded-full mt-2 shadow-inner" />
                    </motion.div>
                </div>

                {/* Decorative Soft Buttons (static) */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#e0e5ec] shadow-[3px_3px_6px_#bebebe,-3px_-3px_6px_#ffffff]" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#e0e5ec] shadow-[3px_3px_6px_#bebebe,-3px_-3px_6px_#ffffff]" />
                <div className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#e0e5ec] shadow-[3px_3px_6px_#bebebe,-3px_-3px_6px_#ffffff]" />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#e0e5ec] shadow-[3px_3px_6px_#bebebe,-3px_-3px_6px_#ffffff]" />
            </div>

            {/* Subtle Texture Ripple on count */}
            <motion.div
                key={`ripple-${currentCount}`}
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.2 }}
                className="absolute inset-0 border-[20px] border-white/20 rounded-full pointer-events-none"
            />
        </div>
    );
}
