import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string }> },
) {
  const { path } = await params;
  const headers = {
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (!supabaseConfig() || !/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(path))
    return new Response("Not found", { status: 404, headers });
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.storage
    .from("blog-images")
    .download(path);
  if (error || !data)
    return new Response("Not found", { status: 404, headers });
  return new Response(data, {
    headers: { ...headers, "Content-Type": data.type },
  });
}
