import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getSession } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain, experienceLevel } = await req.json();

    const prompt = `Generate 5 highly personalized technical and behavioral interview questions for a ${experienceLevel} ${domain} position. 
    The questions should be challenging and specific to the role's current industry standards.
    Include:
    - 2 Deep Technical questions.
    - 1 System Design / Architecture question.
    - 1 Behavioral (leadership/teamwork) question.
    - 1 Scenario-based problem solving question.
    
    Format the output as a JSON object with a "questions" field containing an array of objects, where each object has a "question" and "category" field.`;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_key_here") {
      return NextResponse.json({
        questions: [
          { question: `Describe your experience with ${domain}.`, category: "General" },
          { question: `What are the most challenging aspects of ${experienceLevel} level work in this field?`, category: "Experience" },
          { question: "How do you handle technical debt in a fast-paced environment?", category: "Technical" },
          { question: "Explain a complex technical problem you solved recently.", category: "Technical" },
          { question: "How do you stay updated with the latest trends in the industry?", category: "Continuous Learning" }
        ]
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert technical interviewer." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    const questions = JSON.parse(content || "{}");

    return NextResponse.json(questions);
  } catch (error) {
    console.error("AI Interview error:", error);
    // Fallback to mock data on any error
    return NextResponse.json({
      questions: [
        { question: `Describe your experience with ${domain}.`, category: "General" },
        { question: `What are the most challenging aspects of ${experienceLevel} level work in this field?`, category: "Experience" },
        { question: "Explain a complex technical problem you solved recently.", category: "Technical" }
      ]
    });
  }
}
