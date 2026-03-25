import { useEffect } from "react";

interface EzoicAdProps {
  placementId: number;
}

/**
 * Ezoic ad placement component.
 * 
 * IMPORTANT (from Ezoic docs):
 * - DO NOT add any styling to the placeholder div
 * - On unmount, placeholders are destroyed to avoid stale ads
 * - showAds() without args shows ALL placeholders on the page
 * 
 * Usage: <EzoicAd placementId={101} />
 */
export default function EzoicAd({ placementId }: EzoicAdProps) {
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

    // Cleanup on unmount (SPA navigation)
    return () => {
      try {
        const ez = (window as any).ezstandalone;
        if (ez && ez.cmd) {
          ez.cmd.push(function () {
            ez.destroyPlaceholders(placementId);
          });
        }
      } catch (e) {
        // silent fail
      }
    };
  }, [placementId]);

  // No className or styling — Ezoic docs explicitly say DO NOT style placeholder divs
  return <div id={`ezoic-pub-ad-placeholder-${placementId}`} />;
}
