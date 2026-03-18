import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy — AI Tool Atlas" 
        description="Privacy policy and data collection practices for AI Tool Atlas." 
      />
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 py-16 prose prose-slate dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            We collect minimal information necessary to provide our services. This includes anonymous usage data (like clicks and page views) to help us understand which AI tools are most popular and improve our directory. If you contact us via email, we will securely store your email address solely for communication purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Cookies and Tracking</h2>
          <p>
            We use third-party services like Google AdSense and analytics tools. These third parties may use cookies, web beacons, and similar technologies to collect or receive information from your website and elsewhere on the internet and use that information to provide measurement services and target ads.
          </p>
          <p className="mt-4">
            Google, as a third-party vendor, uses cookies to serve ads on your site. Google's use of the DART cookie enables it to serve ads to your users based on their visit to your sites and other sites on the Internet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. External Links</h2>
          <p>
            AI Tool Atlas is a directory that links to external AI tools and websites. We are not responsible for the privacy practices or content of these third-party websites. We encourage our users to be aware when they leave our site and to read the privacy statements of every website that collects personally identifiable information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:contact@findaitools.online" className="text-primary hover:underline">contact@findaitools.online</a>.
          </p>
        </section>
      </main>
    </div>
  );
}
