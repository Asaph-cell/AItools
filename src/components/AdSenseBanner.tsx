import { useEffect } from "react";

interface AdSenseBannerProps {
  className?: string;
  client?: string;
  slot?: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: boolean;
}

export default function AdSenseBanner({
  className = "",
  // Optional: Read from .env, or fallback to placeholder
  client = import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX",
  slot = "YYYYYYYYYY", // Replace with actual ad slot ID
  format = "auto",
  responsive = true,
}: AdSenseBannerProps) {
  useEffect(() => {
    try {
      // Attempt to push the ad. In React StrictMode this logs a harmless error on the second pass.
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center bg-card border border-surface-border rounded-lg min-h-[100px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", textAlign: "center" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
