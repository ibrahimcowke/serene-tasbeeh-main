import { motion } from 'framer-motion';

export function DigitalWatch({ currentCount }: { currentCount: number }) {
    return (
        <div className="flex flex-col items-center justify-center -z-10 w-full h-full relative">
            <div className="w-[200px] h-[260px] bg-neutral-900 rounded-[50px] shadow-[inset_0_2px_10px_rgba(255,255,255,0.2),0_10px_30px_rgba(0,0,0,0.8)] border-[4px] border-neutral-700 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute -top-[100px] w-[140px] h-[100px] bg-neutral-800 rounded-t-lg border-x-4 border-neutral-900" />
                <div className="absolute -bottom-[100px] w-[140px] h-[100px] bg-neutral-800 rounded-b-lg border-x-4 border-neutral-900" />

                <div className="w-[180px] h-[230px] bg-black rounded-[40px] border border-neutral-800/50 shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative flex flex-col items-center justify-center overflow-hidden">
                    <div className="font-mono text-5xl font-bold tracking-widest text-[#00ff9d] drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]">
                        {currentCount.toString().padStart(4, '0')}
                    </div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,157,0.1)_0%,transparent_70%)] pointer-events-none"
                    />
                    <div className="absolute top-0 right-0 w-full h-[40%] bg-gradient-to-b from-white/10 to-transparent transform -skew-y-12 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
