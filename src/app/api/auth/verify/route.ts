import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { phone_number, otp_code } = await req.json();

    if (!phone_number || !otp_code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Find OTP in DB
    const { data: session, error } = await supabase
      .from("otp_sessions")
      .select("*")
      .eq("phone_number", phone_number)
      .eq("otp_code", otp_code)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    // 2. Check Expiration
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // 3. Delete OTP (Used)
    await supabase.from("otp_sessions").delete().eq("id", session.id);

    // 4. Get User details for token
    const { data: user } = await supabase
      .from("users")
      .select("id, full_name")
      .eq("phone_number", phone_number)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Generate JWT
    const token = await signToken({ phone_number, sub: user.id });

    // 6. Set Cookie using Native Next.js App Router API
    const cookieStore = await cookies();
    cookieStore.set("legal_vani_session", token, {
      httpOnly: false, // temporarily disabled
      secure: false, // strictly false for localhost
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true, user: { name: user.full_name }, token });

  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
