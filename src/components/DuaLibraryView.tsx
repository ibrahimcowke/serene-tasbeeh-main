import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, ChevronDown, ChevronUp, Heart, Volume2, Copy, Check, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { duas, duaCategories, type Dua } from "@/data/duas";
import { useTranslation } from "@/lib/i18n";
import { useTasbeehStore } from "@/store/tasbeehStore";
import { speakArabic } from "@/lib/audioRecitations";
import { toast } from "sonner";

interface DuaLibraryViewProps {
  children: React.ReactNode;
}

const categoryIcons: Record<string, string> = {
  all: "📿",
  favorites: "❤️",
  morning: "🌅",
  evening: "🌆",
  prayer: "🕌",
  protection: "🛡️",
  special: "⭐",
  gratitude: "🤲",
  general: "✨",
};

function DuaCard({ dua }: { dua: Dua }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const favoriteDuaIds = useTasbeehStore((s) => s.favoriteDuaIds) || [];
  const toggleFavoriteDua = useTasbeehStore((s) => s.toggleFavoriteDua);
  const setDhikr = useTasbeehStore((s) => s.setDhikr);

  const isFavorited = favoriteDuaIds.includes(dua.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteDua(dua.id);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites! ❤️');
  };

  const handleSetAsDhikr = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDhikr({
      id: dua.id,
      arabic: dua.arabic,
      translation: dua.translation,
      transliteration: dua.transliteration,
      category: dua.category
    });
    toast.success('Dua loaded into Tasbeeh Counter! 📿');
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    speakArabic(dua.arabic);
    setTimeout(() => setIsPlayingAudio(false), 4000);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `${dua.arabic}\n\n${dua.transliteration}\n\n"${dua.translation}"\n- Source: ${dua.source}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success('Dua copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${
        expanded ? 'border-primary/40 bg-card shadow-md' : 'border-border/40 bg-card/60 hover:bg-card/90'
      }`}
      onClick={() => setExpanded((p) => !p)}
    >
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-right text-xl leading-relaxed font-arabic mb-1 text-primary font-bold"
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              direction: "rtl",
            }}
          >
            {dua.arabic}
          </p>
          <p className="text-xs text-muted-foreground italic truncate mt-1">
            {dua.transliteration}
          </p>
        </div>
        <div className="shrink-0 pt-1 flex items-center gap-1.5">
          <button
            onClick={handlePlayAudio}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isPlayingAudio ? 'bg-primary/20 text-primary animate-pulse' : 'text-muted-foreground/60 hover:text-foreground hover:bg-white/5'
            }`}
            title="Listen to Dua Recitation"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleFavorite}
            className="p-1.5 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-muted-foreground/60 hover:text-foreground"
            title="Favorite Dua"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4 border-t border-border/30 pt-3 space-y-3 bg-muted/10"
          >
            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
              "{dua.translation}"
            </p>
            
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/20">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {dua.source}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-muted/40 border border-border/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  title="Copy Dua"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleSetAsDhikr}
                  className="text-[10px] px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-black uppercase tracking-wider cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  Set as Active Dhikr
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DuaLibraryContent() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { t } = useTranslation();
  const favoriteDuaIds = useTasbeehStore((s) => s.favoriteDuaIds) || [];

  const filtered = duas.filter((d) => {
    let matchCat = true;
    if (activeCategory === 'favorites') {
      matchCat = favoriteDuaIds.includes(d.id);
    } else if (activeCategory !== 'all') {
      matchCat = d.category === activeCategory;
    }
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      d.translation.toLowerCase().includes(q) ||
      d.transliteration.toLowerCase().includes(q) ||
      d.arabic.includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className="flex flex-col h-full gap-3 px-6 pt-2">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9 bg-card/60 border-border/40 rounded-xl text-sm h-11"
          placeholder={t('duas.search') || "Search duas in Arabic, English, or transliteration..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide py-1">
        {duaCategories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const count = cat.id === 'all' 
            ? duas.length 
            : cat.id === 'favorites' 
            ? favoriteDuaIds.length 
            : duas.filter(d => d.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-transparent shadow-sm'
                  : 'bg-card/60 text-muted-foreground border-border/40 hover:bg-card hover:text-foreground'
              }`}
            >
              <span>{categoryIcons[cat.id] || "📿"}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dua List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pb-8 pt-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground text-center">
            <BookOpen className="w-12 h-12 opacity-30" />
            <p className="text-sm font-semibold">No duas found</p>
            <p className="text-xs text-muted-foreground/70">
              {activeCategory === 'favorites' ? 'You have no favorited duas yet.' : 'Try adjusting your search query.'}
            </p>
          </div>
        ) : (
          filtered.map((dua) => <DuaCard key={dua.id} dua={dua} />)
        )}
      </div>
    </div>
  );
}

export function DuaLibraryView({ children }: DuaLibraryViewProps) {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[90vh] p-0 overflow-hidden flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
        <SheetDescription className="sr-only">
          Browse and read common Islamic duas with audio recitation.
        </SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
              <SheetTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                <BookOpen className="w-5 h-5 text-primary" />
                {t('duas.title') || "Dua Library & Supplications"}
              </SheetTitle>
            </SheetHeader>
            <DuaLibraryContent />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
