import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { full_name, age, phone_number, password } = await req.json();

    if (!full_name || !age || !phone_number || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 1. Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("phone_number", phone_number)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert User
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ full_name, age, phone_number, password_hash }]);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 });
    }

    // 4. Generate Mock OTP
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins

    // 5. Save OTP
    const { error: otpError } = await supabase
      .from("otp_sessions")
      .insert([{ phone_number, otp_code, expires_at }]);

    if (otpError) {
      console.error(otpError);
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 });
    }

    // 6. Mock SMS Delivery (Console + UI)
    console.log(`\n\n=========================================`);
    console.log(`💬 MOCK SMS: Your Legal-Vani verification code is: ${otp_code}`);
    console.log(`=========================================\n\n`);

    return NextResponse.json({ success: true, message: "OTP sent to phone", mock_otp: otp_code });

  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
