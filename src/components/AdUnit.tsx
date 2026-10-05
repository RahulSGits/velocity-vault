import React, { useEffect } from 'react';
import { cn } from '@/src/utils/cn';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: boolean;
}

/**
 * Velocity Vault Ad Component
 * Integration: Replace 'ca-pub-XXXXXXXXXXXXXXXX' in index.html with your actual ID.
 */
export function AdUnit({ slot, format = 'auto', className, label = true }: AdUnitProps) {
  const adRef = React.useRef<HTMLDivElement>(null);
  const initialized = React.useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) return;
    
    const tryInitAd = () => {
      if (!adRef.current) return;
      
      // Error Fix: No slot size for availableWidth=0
      // Check if the container is actually visible and has width
      const width = adRef.current.offsetWidth;
      if (width === 0) {
        // If not ready, wait a bit and try once more
        setTimeout(tryInitAd, 500);
        return;
      }

      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        
        // Final check to ensure we haven't initialized in the meantime
        // or that this specific tag isn't already active
        const ins = adRef.current.querySelector('ins');
        if (ins && !ins.hasAttribute('data-adsbygoogle-status')) {
          adsbygoogle.push({});
          initialized.current = true;
        }
      } catch (e) {
        console.error('AdSense error:', e);
      }
    };

    // Give the browser a moment to settle the layout (prevents width=0 error)
    const timeoutId = setTimeout(tryInitAd, 200);
    
    return () => clearTimeout(timeoutId);
  }, [slot]);

  return (
    <div ref={adRef} className={cn("my-8 w-full overflow-hidden flex flex-col items-center", className)}>
      {label && (
        <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2">Advertisement</span>
      )}
      <div className="w-full glass rounded-3xl border border-white/5 p-4 min-h-[100px] flex items-center justify-center">
        {/* Real AdSense Ins Tag */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        
        {/* Developer Note: Hidden in production when ads load */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
           <span className="text-sm font-mono italic">Ad Slot: {slot}</span>
        </div>
      </div>
    </div>
  );
}
