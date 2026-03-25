import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useAutoContentBySlug } from "@/hooks/useAutoContent";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

function renderMarkdown(md: string): string {
  // Simple markdown to HTML converter for auto-generated content
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3 text-foreground">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 text-foreground">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-extrabold mt-6 mb-4 text-foreground">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-muted-foreground">$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-muted-foreground">$1</li>')
    .replace(/^---$/gm, '<hr class="border-surface-border my-6" />')
    .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed mb-4">')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return match;
    });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useAutoContentBySlug(slug || "");

  const htmlContent = useMemo(() => {
    if (!post) return "";
    return renderMarkdown(post.content);
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">This article doesn't exist or has been removed.</p>
          <Button asChild><Link to="/blog">Browse Articles</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.title}
        description={post.meta_description || post.content.slice(0, 160)}
        canonical={`https://findaitools.online/blog/${slug}`}
      />
      <Navbar />
      <article className="container max-w-4xl mx-auto px-4 py-8">
        <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
            {post.content_type.replace("-", " ")}
          </span>
          {post.category && (
            <span className="text-sm text-muted-foreground">{post.category}</span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-8">
          Published {new Date(post.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="mt-12 pt-8 border-t border-surface-border text-center">
          <Button variant="outline" asChild>
            <Link to="/blog">More Articles</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
