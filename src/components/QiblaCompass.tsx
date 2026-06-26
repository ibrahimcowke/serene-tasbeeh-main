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
              const x = 50 + 42 * Math.cos(rad);
              const y = 50 + 42 * Math.sin(rad);
              return (
                <span
                  key={label}
                  className="absolute text-xs font-bold"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%,-50%)',
                    color: label === 'N' ? '#ef4444' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {label}
                </span>
              );
            })}

            {/* Compass tick marks */}
            {[...Array(36)].map((_, i) => {
              const deg = i * 10;
              const rad = toRad(deg - 90);
              const inner = i % 9 === 0 ? 0.72 : 0.78;
              const outer = 0.85;
              const x1 = 50 + inner * 50 * Math.cos(rad);
              const y1 = 50 + inner * 50 * Math.sin(rad);
              const x2 = 50 + outer * 50 * Math.cos(rad);
              const y2 = 50 + outer * 50 * Math.sin(rad);
              return (
                <svg key={i} className="absolute inset-0 w-full h-full">
                  <line
                    x1={`${x1}%`} y1={`${y1}%`}
                    x2={`${x2}%`} y2={`${y2}%`}
                    stroke={`hsl(var(--primary) / ${i % 9 === 0 ? '0.5' : '0.2'})`}
                    strokeWidth={i % 9 === 0 ? 2 : 1}
                  />
                </svg>
              );
            })}

            {/* Qibla needle */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: needleRotation }}
              transition={{ type: 'spring', stiffness: 60, damping: 18 }}
            >
              {/* Kaaba icon at tip */}
              <div
                className="absolute"
                style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-lg"
                  style={{
                    background: isFacingQibla
                      ? 'rgba(16,185,129,0.3)'
                      : 'rgba(251,191,36,0.2)',
                    border: `2px solid ${isFacingQibla ? 'rgb(16,185,129)' : 'rgb(251,191,36)'}`,
                    boxShadow: `0 0 12px ${isFacingQibla ? 'rgba(16,185,129,0.4)' : 'rgba(251,191,36,0.3)'}`,
                  }}
                >
                  🕋
                </div>
              </div>
              {/* Needle line */}
              <div
                className="w-0.5 rounded-full"
                style={{
                  height: '40%',
                  background: `linear-gradient(to top, transparent 0%, ${isFacingQibla ? 'rgb(16,185,129)' : 'rgb(251,191,36)'} 100%)`,
                  marginBottom: '0',
                  position: 'absolute',
                  top: '18%',
                }}
              />
            </motion.div>

            {/* Center dot */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{
                background: 'hsl(var(--primary))',
                boxShadow: '0 0 10px hsl(var(--primary)/0.5)',
              }}
            />
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: 'hsl(var(--card)/0.6)', border: '1px solid hsl(var(--border)/0.4)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {t('qibla.bearing')}
              </p>
              <p className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
                {qiblaBearing !== null ? `${Math.round(qiblaBearing)}°` : '—'}
              </p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: 'hsl(var(--card)/0.6)', border: '1px solid hsl(var(--border)/0.4)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Distance
              </p>
              <p className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
                {distanceKm ? `${distanceKm}` : '—'}
              </p>
              <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>km</p>
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
      </SheetContent>
    </Sheet>
  );
}
