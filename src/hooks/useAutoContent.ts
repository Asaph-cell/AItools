import { useQuery } from "@tanstack/react-query";
import { supabase, AutoContent } from "@/lib/supabaseClient";

export function useAutoContent(contentType?: string) {
  return useQuery<AutoContent[]>({
    queryKey: ["auto_content", contentType],
    queryFn: async () => {
      let query = (supabase as any)
        .from("auto_content")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (contentType) {
        query = query.eq("content_type", contentType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as AutoContent[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useAutoContentBySlug(slug: string) {
  return useQuery<AutoContent | null>({
    queryKey: ["auto_content", "slug", slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("auto_content")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data || null) as AutoContent | null;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}
