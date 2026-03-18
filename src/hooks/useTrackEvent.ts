import { supabase } from "@/integrations/supabase/client";

export function trackEvent(toolId: string, eventType: "click" | "quiz_match" | "comparison") {
  // Fire and forget — don't block UI
  supabase.functions.invoke("track-event", {
    body: { tool_id: toolId, event_type: eventType },
  }).catch(console.error);
}
