import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, ChevronDown, ChevronUp, Heart, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { duas, duaCategories, type Dua } from "@/data/duas";
import { useTranslation } from "@/lib/i18n";
import { useTasbeehStore } from "@/store/tasbeehStore";
import { toast } from "sonner";

interface DuaLibraryViewProps {
  children: React.ReactNode;
}

const categoryIcons: Record<string, string> = {
  all: "📿",
  morning: "🌅",
  evening: "🌆",
  prayer: "🕌",
  protection: "🛡️",
  gratitude: "🤲",
  general: "✨",
};

function DuaCard({ dua }: { dua: Dua }) {
  const [expanded, setExpanded] = useState(false);
  const favoriteDuaIds = useTasbeehStore((s) => s.favoriteDuaIds) || [];
  const toggleFavoriteDua = useTasbeehStore((s) => s.toggleFavoriteDua);
  const setDhikr = useTasbeehStore((s) => s.setDhikr);

  const isFavorited = favoriteDuaIds.includes(dua.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteDua(dua.id);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites!');
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
    toast.success('Dua loaded into counter! 📿');
  };

  return (
    <motion.div
      layout
      className="rounded-2xl border border-border/40 overflow-hidden cursor-pointer"
      style={{ background: "hsl(var(--card) / 0.6)" }}
      onClick={() => setExpanded((p) => !p)}
    >
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-right text-lg leading-relaxed font-arabic mb-1"
            style={{
              color: "hsl(var(--primary))",
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              direction: "rtl",
            }}
          >
            {dua.arabic}
          </p>
          <p className="text-xs text-muted-foreground italic truncate">
            {dua.transliteration}
          </p>
        </div>
        <div className="shrink-0 pt-1 flex items-center gap-2">
          <button 
            onClick={handleFavorite}
            className="p-1 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-muted-foreground/60 hover:text-foreground"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 border-t border-border/30 pt-3 space-y-3"
        >
          <p className="text-sm text-foreground/90 leading-relaxed">
            {dua.translation}
          </p>
          
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              {dua.source}
            </span>
            <button
              onClick={handleSetAsDhikr}
              className="text-[10px] px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all font-black uppercase tracking-wider cursor-pointer"
            >
              Set as Dhikr
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function DuaLibraryContent() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { t } = useTranslation();

  const filtered = duas.filter((d) => {
    const matchCat = activeCategory === "all" || d.category === activeCategory;
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      d.translation.toLowerCase().includes(q) ||
      d.transliteration.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9 bg-card/60 border-border/40 rounded-xl text-sm"
          placeholder={t('duas.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {duaCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            style={
              activeCategory === cat.id
                ? {
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    borderColor: "transparent",
                  }
                : {
                    background: "hsl(var(--card) / 0.5)",
                    color: "hsl(var(--foreground) / 0.7)",
                    borderColor: "hsl(var(--border) / 0.5)",
                  }
            }
          >
            <span>{categoryIcons[cat.id]}</span>
            {t(`duas.category.${cat.id}`)}
          </button>
        ))}
      </div>

      {/* Dua List */}
      <div className="flex-1 overflow-y-auto space-y-2 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <BookOpen className="w-10 h-10 opacity-30" />
            <p className="text-sm">{t('duas.empty')}</p>
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
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[88vh]" dir={isRTL ? "rtl" : "ltr"}>
        <SheetDescription className="sr-only">
          Browse and read common Islamic duas.
        </SheetDescription>
        {open && (
          <>
            <div className="sheet-handle" />
            <SheetHeader className="text-left pb-4">
              <SheetTitle className="text-lg font-medium">{t('duas.title')}</SheetTitle>
            </SheetHeader>
            <DuaLibraryContent />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
