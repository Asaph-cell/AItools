import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Terms of Service — AI Tool Atlas" 
        description="Terms of Service and usage conditions for AI Tool Atlas." 
      />
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 py-16 prose prose-slate dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using AI Tool Atlas (the "Website"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            AI Tool Atlas provides a curated directory and search engine for artificial intelligence tools. We aggregate information from across the web. The information provided is for general conversational and informational purposes only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer of Warranties</h2>
          <p>
            The Website and its content are provided on an "as is" and "as available" basis without any warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any tools listed. Pricing, features, and availability of third-party tools are subject to change without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Affiliate and Advertising Disclosure</h2>
          <p>
            AI Tool Atlas displays advertisements served by Google AdSense and may contain affiliate links. We may earn a commission if you click on certain links or purchase products from third-party sites. This does not affect our editorial independence or the objectivity of the tools we list.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
          <p>
            For any queries regarding these Terms of Service, please contact us at: <a href="mailto:contact@findaitools.online" className="text-primary hover:underline">contact@findaitools.online</a>.
          </p>
        </section>
      </main>
    </div>
  );
}
