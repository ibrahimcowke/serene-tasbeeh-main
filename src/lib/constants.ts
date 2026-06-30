export const APP_VERSION = '2.1.1';

export const themes = [
  { id: 'light', label: 'Light', description: 'Warm and calm' },
  { id: 'theme-midnight', label: 'Midnight', description: 'Deep blue serenity' },
  { id: 'theme-glass', label: 'Glass', description: 'Pure & icy morphism' },
  { id: 'theme-sunset', label: 'Sunset', description: 'Warm gradients' },
  { id: 'theme-forest', label: 'Forest', description: 'Deep nature greens' },
  { id: 'theme-oled', label: 'OLED', description: 'True black power saver' },
  { id: 'theme-mecca-night', label: 'Mecca Night', description: 'Deep purple & gold' },
  { id: 'theme-desert-starlight', label: 'Desert Star', description: 'Sand beige & blue' },
  { id: 'theme-ramadan-lantern', label: 'Lantern Glow', description: 'Burgundy & amber' },
  { id: 'theme-rose-bloom', label: 'Rose Bloom', description: 'Sage green & rose' },
  { id: 'theme-emerald-shine', label: 'Emerald Glow', description: 'Sacred green & gold shine' },
  { id: 'theme-cyberpunk-zen', label: 'Cyber Zen', description: 'Neon cyan & obsidian' },
  { id: 'theme-ocean-depth', label: 'Ocean Depth', description: 'Deep marine serenity' },
  { id: 'theme-sakura-zen', label: 'Sakura Zen', description: 'Cherry blossom & sage' },
] as const;

export const counterShapes = [
  { id: 'plain', label: 'Plain', icon: '◌', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' },
  { id: 'minimal', label: 'Minimal', icon: '○', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
  { id: 'classic', label: 'Classic', icon: '□', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)' },
  { id: 'beads', label: 'Beads', icon: '◎', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)' },
  { id: 'flower', label: 'Flower', icon: '🌸', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.1)' },
  { id: 'waveform', label: 'Wave', icon: '〰', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.1)' },
  { id: 'digital', label: 'Digit', icon: '88', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)' },
  { id: 'modern-ring', label: 'Ring', icon: '○', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' },
  { id: 'vintage-wood', label: 'Wood', icon: '▧', color: '#a8a29e', bg: 'rgba(168, 162, 158, 0.1)' },
  { id: 'ring-light', label: 'Light', icon: '⭕', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
  { id: 'bead-ring', label: 'Bead Ring', icon: '📿', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'halo-ring', label: 'Halo', icon: '💫', color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  { id: 'vertical-capsules', label: 'Capsule', icon: '💊', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  { id: 'luminous-beads', label: 'LumiB', icon: '📿', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' },
  { id: 'smart-ring', label: 'Smart Ring', icon: '⌚', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)' },
  { id: 'moon-phase', label: 'Moon', icon: '🌙', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  { id: 'digital-watch', label: 'Watch', icon: '⌚', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.1)' },
  { id: 'tally-clicker', label: 'Tally 3D', icon: '🖱️', color: '#71717a', bg: 'rgba(113, 113, 122, 0.1)' },
  { id: 'neumorph', label: 'Neumorph', icon: '☁', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  { id: 'green-tally', label: 'Green Tally', icon: '📟', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'retro-lcd', label: 'Retro LCD', icon: '📟', color: '#8b9b82', bg: 'rgba(139, 155, 130, 0.1)' },
  { id: 'sunset-horizon', label: 'Sunset', icon: '🌅', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
] as const;

// Dashboard Layouts removed in favor of single default design
