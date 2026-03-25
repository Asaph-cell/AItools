import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  jsonLd?: object;
}

export default function SEO({
  title = "Find AI Tools — Find the Perfect AI Tool in 30 Seconds",
  description = "Discover the best AI tools for coding, research, writing, automation, and more. Take a 30-second quiz or browse our directory of 20+ AI tools.",
  keywords = "AI tools, artificial intelligence, productivity tools, coding AI, writing AI, research AI",
  canonical = "https://findaitools.online",
  ogType = "website",
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  twitterCard = "summary_large_image",
  jsonLd,
}: SEOProps) {
  const fullTitle = title.includes("Find AI Tools") ? title : `${title} | Find AI Tools`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
