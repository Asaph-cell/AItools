import { useQuery } from "@tanstack/react-query";
import { supabase, AiTool } from "@/lib/supabaseClient";

export function useTools() {
  return useQuery<AiTool[]>({
    queryKey: ["ai_tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .order("featured", { ascending: false })
        .order("rating", { ascending: false });
      if (error) throw error;
      return data as AiTool[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
