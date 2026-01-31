import { motion } from 'framer-motion';

interface ZenStonesProps {
    currentCount: number;
}

export function ZenStones({ currentCount }: ZenStonesProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="relative w-[300px] h-[400px] flex flex-col items-center justify-center gap-1">

                {/* Top Stone */}
                <motion.div
                    className="relative z-30"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg width="100" height="60" viewBox="0 0 100 60" className="drop-shadow-lg text-stone-300">
                        <path
                            d="M10,40 Q30,5 90,40 Q95,50 50,55 Q5,55 10,40 Z"
                            fill="#d6d3d1" // stone-300
                            stroke="#a8a29e" // stone-400
                            strokeWidth="1"
                        />
                        {/* Highlight */}
                        <path d="M30,20 Q60,10 80,30" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none" />
                    </svg>
                </motion.div>

                {/* Middle Stone */}
                <motion.div
                    className="relative z-20 -mt-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <svg width="140" height="70" viewBox="0 0 140 70" className="drop-shadow-lg text-stone-400">
                        <path
                            d="M10,40 Q40,10 130,40 Q135,55 70,65 Q5,60 10,40 Z"
                            fill="#a8a29e" // stone-400
                            stroke="#78716c" // stone-500
                            strokeWidth="1"
                        />
                        {/* Highlight */}
                        <path d="M30,30 Q80,15 110,35" stroke="white" strokeWidth="2" strokeOpacity="0.2" fill="none" />
                    </svg>
                </motion.div>

                {/* Bottom Stone */}
                <motion.div
                    className="relative z-10 -mt-2"
                    animate={{ y: [0, -1, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                    <svg width="180" height="80" viewBox="0 0 180 80" className="drop-shadow-lg text-stone-500">
                        <path
                            d="M10,50 Q60,10 170,50 Q175,70 90,75 Q5,70 10,50 Z"
                            fill="#78716c" // stone-500
                            stroke="#57534e" // stone-600
                            strokeWidth="1"
                        />
                        {/* Highlight */}
                        <path d="M40,40 Q100,20 150,45" stroke="white" strokeWidth="2" strokeOpacity="0.1" fill="none" />
                    </svg>
                </motion.div>

                {/* Shadow */}
                <div className="w-32 h-4 bg-black/20 blur-xl rounded-[100%] mt-4" />

                {/* Count Flash Effect Over Stones */}
                <motion.div
                    key={currentCount}
                    className="absolute inset-0 bg-white/10 rounded-full blur-3xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 0.3 }}
                />

            </div>
        </div>
    );
}
