import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, Navigation, RefreshCw } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTranslation } from '@/lib/i18n';

interface QiblaCompassProps {
  children: React.ReactNode;
}

// Mecca coordinates
const MECCA_LAT = 21.3891;
const MECCA_LNG = 39.8579;

function toRad(deg: number) { return deg * (Math.PI / 180); }
function toDeg(rad: number) { return rad * (180 / Math.PI); }

function calcQiblaBearing(lat: number, lng: number): number {
  const dLng = toRad(MECCA_LNG - lng);
  const lat1 = toRad(lat);
  const lat2 = toRad(MECCA_LAT);
  const x = Math.sin(dLng) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(x, y)) + 360) % 360;
}

function distance(lat: number, lng: number): string {
  const R = 6371;
  const dLat = toRad(MECCA_LAT - lat);
  const dLng = toRad(MECCA_LNG - lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(MECCA_LAT)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(0);
}

export function QiblaCompass({ children }: QiblaCompassProps) {
  const [open, setOpen] = useState(false);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [permissionState, setPermissionState] = useState<'pending' | 'granted' | 'denied'>('pending');
  const headingRef = useRef(0);
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    if (!open) return;

    // Get location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const bearing = calcQiblaBearing(pos.coords.latitude, pos.coords.longitude);
        const dist = distance(pos.coords.latitude, pos.coords.longitude);
        setQiblaBearing(bearing);
        setDistanceKm(dist);
      },
      () => {
        // Fallback: use Mecca as reference with a default city (Istanbul)
        setQiblaBearing(calcQiblaBearing(41.0082, 28.9784));
        setDistanceKm('~2500');
        setLocationError(true);
      },
      { timeout: 8000 }
    );

    // Device orientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = 0;
      if ((e as any).webkitCompassHeading !== undefined) {
        heading = (e as any).webkitCompassHeading; // iOS
      } else if (e.alpha !== null) {
        heading = 360 - e.alpha; // Android
      }
      headingRef.current = heading;
      setDeviceHeading(heading);
      setPermissionState('granted');
    };

    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const res = await (DeviceOrientationEvent as any).requestPermission();
          if (res === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          } else {
            setPermissionState('denied');
          }
        } catch {
          setPermissionState('denied');
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
        setPermissionState('granted');
      }
    };

    requestPermission();
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [open]);

  // The needle rotation: qibla bearing minus current device heading
  const needleRotation = qiblaBearing !== null && deviceHeading !== null
    ? qiblaBearing - deviceHeading
    : 0;

  const isFacingQibla = Math.abs(((needleRotation % 360) + 360) % 360) < 15 || Math.abs(((needleRotation % 360) + 360) % 360 - 360) < 15;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[88vh] flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <SheetDescription className="sr-only">Find the Qibla direction toward Mecca.</SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-center px-6 pt-2 pb-4 shrink-0">
              <SheetTitle className="text-lg font-medium flex items-center justify-center gap-2">
                <Compass className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                {t('qibla.title')}
              </SheetTitle>
              <p className="text-xs text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {t('qibla.subtitle')}
              </p>
            </SheetHeader>

            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 pb-8">
              {/* Compass rose */}
              <div className="relative w-64 h-64">
                {/* Outer decorative ring */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, hsl(var(--primary)/0.05), hsl(var(--primary)/0.15), hsl(var(--primary)/0.05))',
                    border: '2px solid hsl(var(--primary)/0.2)',
                  }}
                />
                {/* Cardinal directions */}
                {[
                  { label: 'N', deg: 0 }, { label: 'E', deg: 90 },
                  { label: 'S', deg: 180 }, { label: 'W', deg: 270 },
                ].map(({ label, deg }) => {
                  const rad = toRad(deg - 90);
                  const x = 128 + 110 * Math.cos(rad);
                  const y = 128 + 110 * Math.sin(rad);
                  return (
                    <span
                      key={label}
                      className="absolute text-[10px] font-bold"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)',
                        color: label === 'N' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground)/0.6)',
                      }}
                    >
                      {label}
                    </span>
                  );
                })}

                {/* Compass dial */}
                <motion.div
                  className="absolute inset-4 rounded-full flex items-center justify-center"
                  style={{
                    background: 'hsl(var(--card)/0.8)',
                    boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.3)',
                    border: '1px solid hsl(var(--border)/0.5)',
                  }}
                  animate={{ rotate: deviceHeading !== null ? -deviceHeading : 0 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                >
                  {/* Qibla arrow indicator */}
                  {qiblaBearing !== null && (
                    <motion.div
                      className="absolute w-full h-full flex flex-col items-center pt-2"
                      style={{ transform: `rotate(${qiblaBearing}deg)` }}
                    >
                      <div
                        className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                        style={{ transform: 'translateY(-4px)' }}
                      />
                      <span className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-wider">Qibla</span>
                    </motion.div>
                  )}

                  {/* Standard North arrow */}
                  <div className="absolute w-full h-full flex flex-col items-center pt-2">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-red-500" />
                  </div>

                  {/* Center pin */}
                  <div className="w-3 h-3 rounded-full bg-neutral-200 border-2 border-neutral-800 z-10" />
                </motion.div>
              </div>

              {/* Angle display */}
              <div className="flex gap-4">
                <div
                  className="flex flex-col items-center px-4 py-2 rounded-2xl min-w-[100px]"
                  style={{ background: 'hsl(var(--card)/0.6)', border: '1px solid hsl(var(--border)/0.4)' }}
                >
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {t('qibla.heading')}
                  </p>
                  <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                    {deviceHeading !== null ? `${Math.round(deviceHeading)}°` : '—'}
                  </p>
                </div>

                <div
                  className="flex flex-col items-center px-4 py-2 rounded-2xl min-w-[100px]"
                  style={{ background: 'hsl(var(--card)/0.6)', border: '1px solid hsl(var(--border)/0.4)' }}
                >
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {t('qibla.distance')}
                  </p>
                  <p className="text-xl font-bold font-mono text-foreground mt-0.5 flex items-baseline gap-0.5">
                    {distanceKm !== null ? distanceKm : '—'}
                    <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>km</span>
                  </p>
                </div>
              </div>

              {/* Facing Qibla indicator */}
              <AnimatePresence>
                {isFacingQibla && deviceHeading !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl"
                    style={{
                      background: 'rgba(16,185,129,0.15)',
                      border: '1px solid rgba(16,185,129,0.4)',
                    }}
                  >
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">
                      {t('qibla.facing')} 🕋
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {locationError && (
                <p className="text-xs text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  ⚠️ {t('qibla.location_error')}
                </p>
              )}

              {permissionState === 'pending' && (
                <p className="text-xs text-center animate-pulse" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {t('qibla.calibrate')}
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
