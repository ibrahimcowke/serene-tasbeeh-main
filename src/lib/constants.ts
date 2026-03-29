export const APP_VERSION = '1.3.0';

export const themes = [
  { id: 'light', label: 'Light', description: 'Warm and calm' },
  { id: 'theme-midnight', label: 'Midnight', description: 'Deep blue serenity' },
  { id: 'theme-glass', label: 'Glass', description: 'Pure & icy morphism' },
  { id: 'theme-sunset', label: 'Sunset', description: 'Warm gradients' },
  { id: 'theme-forest', label: 'Forest', description: 'Deep nature greens' },
  { id: 'theme-oled', label: 'OLED', description: 'True black power saver' },

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
  { id: 'luminous-ring', label: 'Lumi', icon: '✨', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
  { id: 'ring-light', label: 'Light', icon: '⭕', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
  { id: 'animated-ripple', label: 'Ripple', icon: '◎', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)' },
  { id: 'bead-ring', label: 'Bead Ring', icon: '📿', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'halo-ring', label: 'Halo', icon: '💫', color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  { id: 'vertical-capsules', label: 'Capsule', icon: '💊', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  { id: 'luminous-beads', label: 'LumiB', icon: '📿', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' },
  { id: 'helix-strand', label: 'Helix', icon: '🧬', color: '#d946ef', bg: 'rgba(217, 70, 239, 0.1)' },
  { id: 'cyber-hexagon', label: 'Hex', icon: '⬡', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { id: 'glass-pill', label: 'iOS Glass', icon: '🔮', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
  { id: 'smart-ring', label: 'Smart Ring', icon: '⌚', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)' },
  { id: 'moon-phase', label: 'Moon', icon: '🌙', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  { id: 'water-ripple', label: 'Ripple', icon: '💧', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { id: 'sand-hourglass', label: 'Hourglass', icon: '⏳', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'lantern-fanous', label: 'Lantern', icon: '🏮', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  { id: 'digital-watch', label: 'Watch', icon: '⌚', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.1)' },
  { id: 'tally-clicker', label: 'Tally 3D', icon: '🖱️', color: '#71717a', bg: 'rgba(113, 113, 122, 0.1)' },
  { id: 'cyber-3d', label: 'Cyber 3D', icon: '💎', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { id: 'crystal-iso', label: 'Crystal ISO', icon: '🕋', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'neumorph', label: 'Neumorph', icon: '☁', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
] as const;

// Dashboard Layouts removed in favor of single default design
