import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, FileText } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from '@/lib/i18n';

interface StatsShareCardProps {
  children: React.ReactNode;
}

function getWeeklyTotal(dailyRecords: { date: string; totalCount: number; counts: Record<string, number> }[]) {
  const now = new Date();
  let total = 0;
  let bestDay = 0;
  let bestDayDate = '';
  const topDhikrMap: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const rec = dailyRecords.find((r) => r.date === ds);
    if (rec) {
      total += rec.totalCount;
      if (rec.totalCount > bestDay) {
        bestDay = rec.totalCount;
        bestDayDate = ds;
      }
      Object.entries(rec.counts).forEach(([id, c]) => {
        topDhikrMap[id] = (topDhikrMap[id] || 0) + c;
      });
    }
  }

  const topDhikrId = Object.entries(topDhikrMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return { total, bestDay, bestDayDate, topDhikrId };
}

export function StatsShareCard({ children }: StatsShareCardProps) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { dailyRecords, streakDays, totalAllTime, dhikrs, currentDhikr } = useTasbeehStore(useShallow(state => ({
    dailyRecords: state.dailyRecords,
    streakDays: state.streakDays,
    totalAllTime: state.totalAllTime,
    dhikrs: state.dhikrs,
    currentDhikr: state.currentDhikr
  })));
  const { t, isRTL } = useTranslation();

  const { total, bestDay, bestDayDate, topDhikrId } = getWeeklyTotal(dailyRecords);
  const topDhikr = dhikrs.find((d) => d.id === topDhikrId) ?? currentDhikr;

  // CSV export
  const handleCSV = () => {
    const header = 'Date,Total,SubhanAllah,Alhamdulillah,AllahuAkbar,Other\n';
    const rows = dailyRecords
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((r) => {
        const s = r.counts['subahanallah'] || 0;
        const a = r.counts['alhamdulillah'] || 0;
        const ak = r.counts['allahuakbar'] || 0;
        const other = r.totalCount - s - a - ak;
        return `${r.date},${r.totalCount},${s},${a},${ak},${other}`;
      })
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasbeehly-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF/Print export
  const handlePrint = () => {
    const printContent = `
      <html>
      <head>
        <title>Tasbeehly Report</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 32px; color: #1e293b; }
          h1 { font-size: 28px; margin-bottom: 4px; }
          h2 { font-size: 16px; color: #64748b; font-weight: 400; margin-bottom: 24px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
          .card { background: #f8fafc; border-radius: 12px; padding: 16px; }
          .card-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
          .card-value { font-size: 28px; font-weight: 700; color: #3b82f6; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #e2e8f0; color: #64748b; }
          td { padding: 8px; border-bottom: 1px solid #f1f5f9; }
          .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <h1>📿 Tasbeehly Report</h1>
        <h2>Generated ${new Date().toLocaleDateString()}</h2>
        <div class="grid">
          <div class="card">
            <div class="card-label">All Time Total</div>
            <div class="card-value">${totalAllTime.toLocaleString()}</div>
          </div>
          <div class="card">
            <div class="card-label">Current Streak</div>
            <div class="card-value">${streakDays} days</div>
          </div>
          <div class="card">
            <div class="card-label">This Week</div>
            <div class="card-value">${total.toLocaleString()}</div>
          </div>
        </div>
        <table>
          <tr><th>Date</th><th>Total</th><th>SubhanAllah</th><th>Alhamdulillah</th><th>AllahuAkbar</th></tr>
          ${dailyRecords.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30).map((r) => `
            <tr>
              <td>${r.date}</td>
              <td><b>${r.totalCount}</b></td>
              <td>${r.counts['subahanallah'] || 0}</td>
              <td>${r.counts['alhamdulillah'] || 0}</td>
              <td>${r.counts['allahuakbar'] || 0}</td>
            </tr>
          `).join('')}
        </table>
        <div class="footer">Tasbeehly v2.1.0 — Your Spiritual Companion</div>
      </body>
      </html>
    `;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(printContent);
      w.document.close();
      w.focus();
      setTimeout(() => w.print(), 400);
    }
  };

  // Native share
  const handleShare = async () => {
    const text = `📿 My Tasbeehly Stats\n\n🔢 This Week: ${total.toLocaleString()}\n🏆 All Time: ${totalAllTime.toLocaleString()}\n🔥 Streak: ${streakDays} days\n📖 Top Dhikr: ${topDhikr.transliteration}\n\nAlhamdulillah! 🤲\n\n#Tasbeehly #Dhikr #IslamicApp`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Tasbeehly Stats', text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <SheetDescription className="sr-only">Share your dhikr statistics.</SheetDescription>
        <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
        <SheetHeader className="text-left px-6 pt-2 pb-4 shrink-0">
          <SheetTitle className="text-lg font-medium flex items-center gap-2">
            <Share2 className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
            {t('share.title')}
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-10 space-y-4">
          {/* Stats card preview */}
          <div
            ref={cardRef}
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary) / 0.12) 0%, hsl(var(--accent) / 0.08) 100%)',
              border: '1px solid hsl(var(--primary) / 0.2)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">📿</span>
              <div>
                <p className="font-bold text-base">Tasbeehly</p>
                <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t('share.weekly'), value: total.toLocaleString() },
                { label: t('share.streak'), value: `${streakDays}d 🔥` },
                { label: 'All Time', value: totalAllTime.toLocaleString() },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: 'hsl(var(--card) / 0.6)' }}
                >
                  <p className="text-xs mb-1 truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>{label}</p>
                  <p className="text-lg font-bold" style={{ color: 'hsl(var(--primary))' }}>{value}</p>
                </div>
              ))}
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'hsl(var(--card) / 0.4)' }}
            >
              <span className="text-base">📖</span>
              <div className="min-w-0">
                <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Top Dhikr</p>
                <p
                  className="text-base font-medium truncate"
                  style={{ fontFamily: "'Amiri', serif", color: 'hsl(var(--primary))' }}
                >
                  {topDhikr.arabic}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex flex-col items-center gap-2 py-4 rounded-xl"
              style={{
                background: 'hsl(var(--primary) / 0.12)',
                border: '1px solid hsl(var(--primary) / 0.25)',
                color: 'hsl(var(--primary))',
              }}
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs font-medium">{t('share.title')}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCSV}
              className="flex flex-col items-center gap-2 py-4 rounded-xl"
              style={{
                background: 'hsl(var(--card) / 0.6)',
                border: '1px solid hsl(var(--border) / 0.4)',
                color: 'hsl(var(--foreground))',
              }}
            >
              <Download className="w-5 h-5" />
              <span className="text-xs font-medium">CSV</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="flex flex-col items-center gap-2 py-4 rounded-xl"
              style={{
                background: 'hsl(var(--card) / 0.6)',
                border: '1px solid hsl(var(--border) / 0.4)',
                color: 'hsl(var(--foreground))',
              }}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs font-medium">PDF</span>
            </motion.button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
