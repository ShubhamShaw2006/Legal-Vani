import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { phone_number, password } = await req.json();

    if (!phone_number || !password) {
      return NextResponse.json({ error: "Phone and password required" }, { status: 400 });
    }

    // 1. Get User
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("phone_number", phone_number)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Generate Mock OTP
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60000).toISOString();

    // 4. Save OTP
    const { error: otpError } = await supabase
      .from("otp_sessions")
      .insert([{ phone_number, otp_code, expires_at }]);

    if (otpError) {
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 });
    }

    // 5. Mock SMS Delivery (Console + UI)
    console.log(`\n\n=========================================`);
    console.log(`💬 MOCK SMS: Your Legal-Vani login code is: ${otp_code}`);
    console.log(`=========================================\n\n`);

    return NextResponse.json({ success: true, message: "OTP sent to phone", mock_otp: otp_code });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
