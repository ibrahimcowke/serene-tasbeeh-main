import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Shapes, Check, Paintbrush } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { themes, counterShapes } from '@/lib/constants';

interface StyleCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const StyleCenter: React.FC<StyleCenterProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme, counterShape, setCounterShape } = useTasbeehStore();
    const [activeTab, setActiveTab] = React.useState<'themes' | 'shapes'>('themes');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-2xl z-[100]"
                    />
                    <motion.div
                        initial={{ y: '100%', opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: '100%', opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 max-h-[90vh] lg:top-8 lg:bottom-8 lg:right-8 lg:left-auto lg:w-[480px] lg:max-h-none lg:rounded-[2.5rem] bg-card/95 border border-border/50 shadow-2xl z-[101] flex flex-col overflow-hidden rounded-t-[2.5rem] premium-panel"
                    >
                        {/* Header */}
                        <div className="p-6 pb-4 border-b border-border/10 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-inner">
                                    <Paintbrush className="w-6 h-6 text-primary drop-shadow-sm" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight text-foreground">Design Studio</h2>
                                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Customize your experience</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors border border-foreground/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-4 gap-3 bg-card/40 border-b border-border/10">
                            <button
                                onClick={() => setActiveTab('themes')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'themes'
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100'
                                        : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground scale-[0.98]'
                                    }`}
                            >
                                <Palette className="w-4 h-4" />
                                Color Themes
                            </button>
                            <button
                                onClick={() => setActiveTab('shapes')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'shapes'
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100'
                                        : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground scale-[0.98]'
                                    }`}
                            >
                                <Shapes className="w-4 h-4" />
                                Counter Shapes
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-background/20 relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-card/30 to-transparent pointer-events-none" />

                            {activeTab === 'themes' ? (
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    {themes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={`group relative p-4 rounded-[2rem] border text-left transition-all overflow-hidden ${theme === t.id
                                                    ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/20'
                                                    : 'border-border/40 bg-card/50 hover:border-primary/50 hover:bg-primary/5'
                                                }`}
                                        >
                                            {theme === t.id && (
                                                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                                    <Check className="w-3 h-3 text-primary-foreground" />
                                                </div>
                                            )}
                                            {/* Theme preview dot - applies the theme class to itself to resolve CSS variables */}
                                            <div className={`w-10 h-10 rounded-full mb-4 shadow-inner flex items-center justify-center ${t.id}`} style={{ background: 'hsl(var(--background))', border: '2px solid hsl(var(--border))' }}>
                                                <div className="w-4 h-4 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
                                            </div>
                                            <h3 className="text-sm font-black text-foreground mb-1 tracking-tight">{t.label}</h3>
                                            <p className="text-[10px] items-center text-muted-foreground leading-tight font-medium">{t.description}</p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-4 relative z-10">
                                    {counterShapes.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setCounterShape(s.id as any)}
                                            className={`group relative aspect-square rounded-[2rem] border flex flex-col items-center justify-center gap-3 transition-all ${counterShape === s.id
                                                    ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/20'
                                                    : 'border-border/40 bg-card/50 hover:border-primary/50 hover:bg-primary/5'
                                                }`}
                                        >
                                            {counterShape === s.id && (
                                                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                                                </div>
                                            )}
                                            <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{s.icon}</span>
                                            <span className="text-[9px] font-black text-foreground/70 uppercase tracking-widest text-center px-1">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
