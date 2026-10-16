import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const failure = new URL("/admin/login?invite=invalid", request.url);

  if (!tokenHash || (type !== "invite" && type !== "recovery")) {
    return NextResponse.redirect(failure);
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as EmailOtpType,
  });

  if (error) return NextResponse.redirect(failure);
  return NextResponse.redirect(new URL("/auth/complete", request.url));
}
