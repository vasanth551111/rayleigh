import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PERSONALITIES: Record<string, string> = {
  friendly: "You are Alex, a warm, encouraging interviewer. You acknowledge answers briefly before following up.",
  corporate: "You are Ms. Chen, a formal corporate interviewer. You are precise and methodical.",
  tough: "You are David, a demanding director. You probe weaknesses and never accept vague answers.",
  faang: "You are a Staff Engineer at a top-tier tech company. You expect deep technical reasoning.",
  startup: "You are a startup founder. You care about hustle, impact, and ownership.",
  hr: "You are Jordan, an experienced HR recruiter focused on soft skills and culture fit.",
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
      questionIndex,
      userAnswer,
      allAnswers = [],
      fillerCount = 0,
      answerDuration = 0,
      followUpCount = 0,
    } = await req.json();

    const systemPrompt = `You are a human interviewer, not an AI. NEVER refer to yourself as an AI, assistant, or language model. Act entirely as a real person.
${PERSONALITIES[personality] || PERSONALITIES.friendly}`;

    // Limit follow-ups to 1 max per question to prevent infinite loops
    const maxFollowUpsReached = followUpCount >= 1;

    const followUpInstructions = maxFollowUpsReached
      ? `CRITICAL INSTRUCTION: You have already asked a follow-up for this question. You MUST NOT ask another follow-up. You MUST transition to the next main topic. Use a phrase like "Moving on to the next question", "Let's shift gears", or "Next topic".`
      : `Analyze the answer and decide the best follow-up action:
1. If the answer is VAGUE or INCOMPLETE: Ask a specific clarifying follow-up
2. If the answer mentions a PROJECT or EXPERIENCE: Dig deeper (what stack? what challenge? what outcome?)
3. If the answer is STRONG and COMPLETE: Acknowledge briefly and transition to the next main topic. Use a transition phrase (e.g., "Let's move on to the next question")
4. If the answer shows a WEAKNESS: Politely probe it further`;

    // Analyze the answer quality to decide how to follow up
    const analysisPrompt = `You are conducting a ${interviewType} interview for a ${level}-level ${role} (${domain}).

Current question asked: "${currentQuestion}"
Candidate's answer: "${userAnswer}"
Follow-up count for this question: ${followUpCount}

${followUpInstructions}

Generate your response as the interviewer. It must:
- Be 2-4 sentences maximum
- Acknowledge the candidate's answer naturally in 1 sentence
- If asking a follow-up, ask exactly ONE question.
- If transitioning to the next question, you MUST include a transition phrase indicating you are moving on (e.g. "Moving on to the next question"). Do NOT ask the next question itself, just provide the transition. The system will supply the next question automatically.
- Sound completely natural, like a real human interviewer talking
- NOT include any formatting, headers, or meta-instructions
- NEVER say "As an AI" or mention being an AI.

Respond only as the interviewer, in first person, speaking directly to the candidate.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: analysisPrompt },
      ],
      temperature: 0.75,
      max_tokens: 200,
      stream: false,
    });

    const response = completion.choices[0].message.content || "";

    // Determine if this is a follow-up or moving to next question
    let isFollowUp = response.toLowerCase().includes("?") && !maxFollowUpsReached;

    // If max followups reached, force next question
    if (maxFollowUpsReached) {
      isFollowUp = false;
    }

    return NextResponse.json({
      response,
      isFollowUp,
      nextQuestionIndex: isFollowUp ? questionIndex : questionIndex + 1,
    });

  } catch (error: any) {
    console.error("Interview respond error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
