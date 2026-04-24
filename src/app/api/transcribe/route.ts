import { NextResponse } from "next/server";
import groq from "@/lib/groqClient";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Pass the File directly to Groq. 
    // The Groq SDK supports native File inputs for Next.js environments.
    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
      response_format: "json",
      language: "en", // We can leave blank or "en" / "hi" depending on needs, whisper auto-detects
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
