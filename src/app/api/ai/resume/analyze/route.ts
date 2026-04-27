import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as pdfParseModule from "pdf-parse";
const { PDFParse } = pdfParseModule as any;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const resumeText = formData.get("resumeText") as string;
    const targetJob = formData.get("targetJob") as string;
    const files = formData.getAll("files") as File[];

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 });
    }

    // Extract text from PDFs
    let extractedText = "";
    for (const file of files) {
      if (file.type === "application/pdf") {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const parser = new PDFParse({ data: buffer });
          const textResult = await parser.getText();
          extractedText += `\n\n--- Extracted from ${file.name} ---\n${textResult.text}`;
          await parser.destroy();
        } catch (e) {
          console.error(`Error parsing PDF ${file.name}:`, e);
          extractedText += `\n\n[Error reading file: ${file.name}]`;
        }
      } else {
        extractedText += `\n\n[Attached File: ${file.name} (${file.type})]`;
      }
    }

    const prompt = `You are a world-class career coach and ATS (Applicant Tracking System) expert. 
Analyze the following resume and supporting documents against the Target Job Description. 

RESUME & PROFILE DATA:
${resumeText.substring(0, 3000)}

SUPPORTING DOCUMENTS (Certifications/Files):
${extractedText.substring(0, 5000)}

TARGET JOB:
${targetJob ? targetJob.substring(0, 2000) : "General Tech Role"}

Your goal is to provide a brutal but constructive analysis. If supporting documents were provided, acknowledge them and verify if they support the skills listed.

Return ONLY a valid JSON object:
{
  "score": <number 0-100 matching likelihood>,
  "strengths": [<4-5 specific strong points or matching technical keywords>],
  "weaknesses": [<4-5 specific missing keywords, formatting issues, or lack of metrics>],
  "improvements": [<4-5 highly actionable, specific suggestions to rewrite bullets or add sections>]
}

Focus on:
1. Keyword density (match specific skills from the JD).
2. Quantifiable impact (did they use numbers?).
3. Formatting and readability.
4. Professional tone.`;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional ATS analyzer. You output ONLY valid JSON. No markdown, no conversational filler."
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : raw);

    // Persist resume score to DB
    await prisma.resume.create({
      data: {
        userId: session.userId as string,
        fileUrl: files.length > 0 ? "multiple-files" : "text-paste",
        content: resumeText.substring(0, 500),
        score: analysis.score ?? 0,
      },
    }).catch(() => {});

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.userId as string,
        type: "RESUME_ANALYZED",
        title: "Resume Analyzed",
        description: `ATS Score: ${analysis.score}/100 with ${files.length} supporting files.`,
        pointsEarned: 5 + (files.length * 2), // Extra points for files
      },
    }).catch(() => {});

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("AI Resume Analysis error:", error);
    const status = error.status || 500;
    const message = error.error?.message || error.message || "Failed to analyze resume";
    return NextResponse.json({ error: message }, { status });
  }
}
