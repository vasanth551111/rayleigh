import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const {
      role,
      domain,
      industry,
      interviewType,
      level,
      difficulty,
      personality,
      duration,
      questionsAndAnswers,
      metrics,
    } = await req.json();

    const qaText = questionsAndAnswers
      .map((qa: any, i: number) => `Q${i + 1} [${qa.category}]: ${qa.question}\nAnswer: ${qa.answer || "(No answer given)"}\nAnswer duration: ${qa.duration || 0}s`)
      .join("\n\n");

    const metricsText = `
- Total filler words: ${metrics.totalFillerWords}
- Eye contact score: ${metrics.eyeContactScore}/100
- Average answer length: ${metrics.avgAnswerDuration}s
- Session duration: ${metrics.sessionDuration}s
- Silence incidents: ${metrics.silenceCount}
- Head tilt incidents: ${metrics.headTiltCount}
    `.trim();

    const reportPrompt = `You are an expert interview coach generating a detailed performance report.

CANDIDATE PROFILE:
- Role: ${role}
- Domain: ${domain}
- Industry: ${industry}
- Level: ${level}
- Interview Type: ${interviewType}
- Difficulty: ${difficulty}

SESSION METRICS:
${metricsText}

QUESTIONS AND ANSWERS:
${qaText}

Generate a COMPREHENSIVE, PERSONALIZED interview performance report. Base EVERY piece of feedback on the actual answers and metrics above. Do NOT give generic advice.

Return ONLY valid JSON in this EXACT structure:
{
  "overallScore": <0-100>,
  "scores": {
    "communication": <0-100>,
    "technicalAccuracy": <0-100>,
    "confidence": <0-100>,
    "answerStructure": <0-100>,
    "problemSolving": <0-100>,
    "leadership": <0-100>,
    "bodyLanguage": <0-100>,
    "professionalism": <0-100>,
    "listeningSkill": <0-100>,
    "eyeContact": <0-100>,
    "vocabulary": <0-100>,
    "roleReadiness": <0-100>
  },
  "strengths": [
    { "point": "<specific strength from session>", "evidence": "<quote or observation from actual answer>" }
  ],
  "weaknesses": [
    { "point": "<specific weakness>", "evidence": "<specific observation>", "improvement": "<concrete fix>" }
  ],
  "questionReviews": [
    {
      "questionIndex": <0-based>,
      "whatWasGood": "<specific praise>",
      "whatToImprove": "<specific critique>",
      "idealAnswerOutline": "<3-4 bullet point outline of ideal answer>",
      "score": <0-100>
    }
  ],
  "actionPlan": {
    "week1": ["<specific daily action>", "<specific resource or exercise>", "<specific practice task>"],
    "week2": ["<action>"],
    "week3": ["<action>"],
    "week4": ["<action>"],
    "month1Beyond": ["<long term action>"]
  },
  "hiringRecommendation": "Strong Yes | Yes | Maybe | No",
  "summaryParagraph": "<2-3 sentence honest summary of the candidate's overall performance in this session>"
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an expert interview coach and hiring manager. Respond only with valid JSON, no markdown." },
        { role: "user", content: reportPrompt },
      ],
      temperature: 0.5,
      max_tokens: 3000,
      stream: false,
      response_format: { type: "json_object" },
    });

    const reportRaw = completion.choices[0].message.content || "{}";
    const report = JSON.parse(reportRaw);

    return NextResponse.json(report);

  } catch (error: any) {
    console.error("Interview report error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
