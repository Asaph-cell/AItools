
CREATE OR REPLACE FUNCTION public.increment_tool_counter(_tool_id uuid, _column text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _column = 'click_count' THEN
    UPDATE ai_tools SET click_count = click_count + 1 WHERE id = _tool_id;
  ELSIF _column = 'quiz_match_count' THEN
    UPDATE ai_tools SET quiz_match_count = quiz_match_count + 1 WHERE id = _tool_id;
  ELSIF _column = 'comparison_count' THEN
    UPDATE ai_tools SET comparison_count = comparison_count + 1 WHERE id = _tool_id;
  END IF;
END;
$$;
