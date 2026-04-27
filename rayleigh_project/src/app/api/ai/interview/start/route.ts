import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PERSONALITIES: Record<string, string> = {
  friendly: "You are Alex, a warm, encouraging HR interviewer at a growing startup. You are supportive but professional. You acknowledge good answers with brief positive affirmations before moving on.",
  corporate: "You are Ms. Chen, a senior recruiter at a Fortune 500 corporation. You are formal, methodical, and expect structured, precise answers.",
  tough: "You are David, a demanding engineering director. You challenge every answer, probe weaknesses relentlessly, and accept nothing vague. You are not rude but extremely exacting.",
  faang: "You are a Staff Engineer at a top-tier tech company (FAANG). You expect deep technical reasoning, system design thinking, and real-world scalability insights.",
  startup: "You are a startup founder evaluating a key hire. You care about hustle, adaptability, impact, and ownership. You love stories of building things from scratch.",
  hr: "You are Jordan, a seasoned HR recruiter. You focus on culture fit, communication, soft skills, and role motivation.",
};

export async function POST(req: Request) {
  try {
    const {
      role,
      domain,
      industry,
      interviewType,
      level,
      difficulty,
      duration,
      personality = "friendly",
    } = await req.json();

    const systemPrompt = PERSONALITIES[personality] || PERSONALITIES.friendly;

    const difficultyGuide = ({
      easy: "Ask foundational concepts and simple situational questions.",
      medium: "Ask moderately challenging questions requiring real experience and clear reasoning.",
      hard: "Ask deeply complex questions involving tradeoffs, architectural decisions, edge cases, and leadership challenges.",
    } as Record<string, string>)[difficulty] || "Ask moderately challenging questions.";

    const levelGuide = ({
      fresher: "The candidate is a fresher. Ask about fundamentals, internship experience, academic projects, and learning mindset.",
      entry: "The candidate has 0-2 years experience. Ask about beginner-to-intermediate concepts and simple project experience.",
      mid: "The candidate has 2-5 years experience. Ask about real-world challenges, ownership, and technical depth.",
      senior: "The candidate has 5+ years experience. Expect architecture, leadership, system design, mentoring, and cross-team impact.",
    } as Record<string, string>)[level] || "The candidate has mid-level experience.";

    const typeGuide = ({
      hr: "Focus on motivation, culture fit, career goals, salary expectations, team collaboration, and communication.",
      technical: `Focus heavily on ${domain}-specific technical skills, coding concepts, system design, debugging, and best practices.`,
      behavioral: "Focus on STAR-method behavioral questions: teamwork, conflict resolution, failures, leadership, time management.",
      casestudy: "Present business or technical case studies and evaluate structured problem-solving and analytical thinking.",
      managerial: "Focus on leadership style, team management, stakeholder communication, strategic planning, and conflict resolution.",
      mixed: `Blend technical (${domain}), behavioral, and situational questions equally.`,
    } as Record<string, string>)[interviewType] || "Use a mixed approach.";

    const userPrompt = `You are about to conduct a ${duration}-minute ${interviewType} interview for a ${level}-level ${role} position in the ${industry} industry, specifically for ${domain}.

Start the interview naturally. Generate ONLY a brief greeting. Introduce yourself by name, welcome the candidate to the interview, and let them know you are excited to begin.

Keep it strictly to 2-3 sentences. Do NOT ask any real interview questions yet. We will ask the actual interview questions in the next steps.

Respond ONLY as the interviewer in first person. Keep it natural and conversational. Do NOT include any meta-instructions or formatting headers.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 400,
      stream: false,
    });

    const greeting = completion.choices[0].message.content || "";

    // Generate the initial question set (role-specific)
    const questionPrompt = `Generate exactly 6 highly specific, non-generic interview questions for a ${level}-level ${role} (${domain}, ${industry}).

Interview type: ${interviewType}
Difficulty: ${difficulty}

Rules:
- Questions must be specific to ${domain} and ${role}, not generic
- Vary the question types per the interview type
- Each question should probe different aspects: technical, problem-solving, experience, behavior
- For ${level} level: ${levelGuide}

Return ONLY a valid JSON object with this structure:
{
  "questions": [
    { "id": 1, "question": "...", "category": "Technical|Behavioral|Situational|System Design|HR", "depth": "surface|medium|deep" },
    ...
  ]
}`;

    const questionCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an expert interviewer. Always respond with valid JSON only, no markdown, no explanation." },
        { role: "user", content: questionPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
      stream: false,
      response_format: { type: "json_object" },
    });

    const questionsRaw = questionCompletion.choices[0].message.content || "{}";
    const questions = JSON.parse(questionsRaw);

    return NextResponse.json({
      greeting,
      questions: questions.questions || [],
      sessionMeta: { role, domain, industry, interviewType, level, difficulty, duration, personality },
    });

  } catch (error: any) {
    console.error("Interview start error:", error);
    return NextResponse.json({ error: error.message || "Failed to start interview" }, { status: 500 });
  }
}
