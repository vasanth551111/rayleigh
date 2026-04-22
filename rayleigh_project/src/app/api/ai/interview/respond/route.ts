import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PERSONALITIES: Record<string, string> = {
  friendly: "You are Alex, a warm but professional interviewer. You acknowledge good points with a brief 'I see where you're coming from' or 'That's a valid perspective,' but you always keep the conversation moving toward the next objective.",
  corporate: "You are Ms. Chen, a senior recruiter. You are purely focused on competencies and results. You don't use small talk or flowery language. You listen for keywords like 'impact', 'delivered', and 'revenue'.",
  tough: "You are David, a skeptical technical director. You assume every answer is surface-level until proven otherwise. You don't say 'That's great'; you say 'Explain how that actually worked in production' or 'What were the tradeoffs?'.",
  faang: "You are a Staff Engineer at a top tech firm. You are obsessive about efficiency, scale, and edge cases. You react to answers by pointing out potential bottlenecks or design flaws.",
  startup: "You are a founder looking for a 'builder'. You react to answers by asking about speed-to-market and individual contribution. You value 'scrappiness' over process.",
  hr: "You are Jordan, a culture-fit expert. You react to the 'how' and 'why' of an answer, looking for emotional intelligence and conflict resolution skills.",
};

export async function POST(req: Request) {
  try {
    const {
      role,
      domain,
      level,
      interviewType,
      personality = "friendly",
      currentQuestion,
      userAnswer,
      followUpCount = 0,
    } = await req.json();

    const systemPrompt = `SYSTEM ROLE: ${PERSONALITIES[personality] || PERSONALITIES.friendly}

CRITICAL RULES:
- NEVER act like an AI assistant. You are a HUMAN INTERVIEWER.
- NEVER say "As an AI..." or "I'm here to help."
- NEVER apologize or be overly subservient.
- DO NOT use generic AI filler like "I understand your point" or "That's a very good answer."
- Keep responses brief (2-3 sentences).
- If moving to a new question, start with a natural transition like "Okay, let's shift gears," or "I'd like to move on to..."`;

    const analysisPrompt = `INTERVIEW CONTEXT: ${level} ${role} (${domain})
CURRENT QUESTION: "${currentQuestion}"
CANDIDATE ANSWER: "${userAnswer}"
FOLLOW-UP COUNT: ${followUpCount}

DECISION LOGIC:
- If followUpCount >= 2: You MUST transition to a new topic. Action = "next".
- If the answer was shallow or interesting: Ask ONE probing follow-up. Action = "followup".
- If the answer was complete: Transition to the next topic. Action = "next".

RESPONSE FORMAT:
You must return ONLY a JSON object:
{
  "response": "Your spoken response as the interviewer",
  "action": "followup" | "next"
}

The "response" should be natural. If action is "next", include a transition phrase and then state that we are moving on. Do NOT ask the next question here; just acknowledge and transition.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: analysisPrompt },
      ],
      temperature: 0.8,
      max_tokens: 300,
      stream: false,
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(completion.choices[0].message.content || '{"response": "Okay, let\'s move on.", "action": "next"}');
    
    // Hard override if AI ignores follow-up limit
    const action = followUpCount >= 2 ? "next" : data.action;

    return NextResponse.json({
      response: data.response,
      action: action,
      isFollowUp: action === "followup"
    });

  } catch (error: any) {
    console.error("Interview respond error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
