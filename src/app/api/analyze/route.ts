import { NextResponse } from "next/server";
import groq from "@/lib/groqClient";

const SYSTEM_PROMPT = `You are "Legal-Vani", an AI legal assistant for Indian citizens.
Your job is to classify a legal issue from user input, explain rights simply, and provide step-by-step actions.

IMPORTANT: You must return the output STRICTLY in JSON format with NO markdown wrapping, matching this exact schema:
{
  "issue_category": "string (the overarching legal category)",
  "rights_explanation": "string (simple language, 3-5 sentences explaining what rights apply)",
  "step_by_step_actions": ["step 1", "step 2"],
  "authority_to_approach": { 
    "name": "string (Real authority name, e.g. National Consumer Disputes Redressal Commission)", 
    "contact": "string (MUST provide a real, factual Indian national hotline or portal link, do NOT say 'Local Office')", 
    "address": "string (MUST provide a real generic national address or 'Contact your district office via portal')" 
  },
  "documents_required": ["doc1", "doc2"],
  "emergency_flag": boolean,
  "helpline_numbers": ["string (Real Indian national helplines only, e.g. 1930 for Cyber Crime, 1091 for Women Helpline)"]
}

Base your advice on current Indian Law. If the issue is severe (domestic violence, extreme fraud), set emergency_flag to true and provide national helpline numbers. Keep language extremely accessible. NEVER use placeholders like "Phone number of local office", provide real national hotline numbers!`;

export async function POST(req: Request) {
  try {
    const { text, category } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `User chose category "${category}". The user's input/transcription: "${text}"` }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temp for more factual/structured response
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No response generated.");
    }

    const jsonResult = JSON.parse(responseContent);

    return NextResponse.json(jsonResult);
  } catch (error) {
    console.error("LLM Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze legal text" }, { status: 500 });
  }
}
