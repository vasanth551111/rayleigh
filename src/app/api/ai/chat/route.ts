import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getSession } from "@/lib/auth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        reply: "I'm your AI Career Coach! Ask me about interview tips, resume advice, job search strategies, or career growth. (Note: AI key not configured — this is a demo response.)"
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are Rayleigh, an expert AI Career Coach for students and early-career professionals. 
You help with:
- Interview preparation (behavioral, technical, situational questions)
- Resume writing and ATS optimization tips
- Career roadmap guidance and skill-building
- Job search strategies and networking tips
- Salary negotiation and offer evaluation
Be concise, friendly, and actionable. Use bullet points for lists. Keep responses under 250 words.`
        },
        ...messages
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Ask AI error:", error);
    const status = error.status || 500;
    const message = error.error?.message || error.message || "Failed to generate AI response";
    return NextResponse.json({ error: message }, { status });
  }
}
