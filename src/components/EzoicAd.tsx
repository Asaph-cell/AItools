import { useEffect, useRef } from "react";

interface EzoicAdProps {
  placementId: number;
  className?: string;
}

/**
 * Ezoic ad placement component.
 * Pass in the placement ID from your Ezoic dashboard.
 * Create placements at: https://publisher.ezoic.com/
 */
export default function EzoicAd({ placementId, className = "" }: EzoicAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const ez = (window as any).ezstandalone;
      if (ez && ez.cmd) {
        ez.cmd.push(function () {
          ez.showAds(placementId);
        });
      }
    } catch (e) {
      console.error("Ezoic ad error:", e);
    }
  }, [placementId]);

  return (
    <div
      ref={adRef}
      id={`ezoic-pub-ad-placeholder-${placementId}`}
      className={className}
    />
  );
}
