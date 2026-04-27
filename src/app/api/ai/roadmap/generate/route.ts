import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { desiredRole, currentSkills, timeAvailable } = await req.json();
    const userId = session.userId as string;

    const fallbackRoadmap = [
      { week: 1, title: "Foundations & Core Concepts", description: `Build a solid foundation in ${desiredRole} fundamentals.`, modules: 4, topics: ["Introduction to the field", "Key tools and technologies", "Setting up your environment", "Basic syntax and architecture"] },
      { week: 2, title: "Intermediate & Advanced Topics", description: "Deep dive into more complex concepts and integration.", modules: 6, topics: ["State management / Advanced logic", "API integration and data fetching", "Error handling and debugging", "Security best practices"] },
      { week: 3, title: "Specialization & Best Practices", description: "Master the patterns used by industry professionals.", modules: 5, topics: ["Design patterns", "Testing and QA", "Performance optimization", "Deployment strategies"] },
      { week: 4, title: "Capstone Project & Portfolio", description: "Apply everything you've learned to a real-world project.", modules: 3, topics: ["Project planning", "Building the MVP", "Refining and polishing", "Portfolio presentation"] },
    ];

    let roadmapData = fallbackRoadmap;

    if (process.env.GROQ_API_KEY) {
      const prompt = `Generate a personalized 4-week learning roadmap for someone who wants to become a ${desiredRole}.
Current Skills: ${currentSkills || "None specified"}
Time Available: ${timeAvailable} per week.

Return ONLY a valid JSON object with this structure:
{
  "roadmap": [
    {
      "week": 1,
      "title": "string",
      "description": "string",
      "modules": <number>,
      "topics": ["topic1", "topic2", "topic3", "topic4"]
    }
  ]
}
Generate exactly 4 week entries. Make topics specific and actionable for ${desiredRole}.`;

      try {
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are an expert career counselor and learning architect. Always respond with valid JSON only, no markdown." },
            { role: "user", content: prompt },
          ],
        });

        const raw = completion.choices[0]?.message?.content ?? "{}";
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
        if (parsed.roadmap?.length) roadmapData = parsed.roadmap;
      } catch {
        // Use fallback
      }
    }

    // Save to DB (upsert by role for this user)
    const saved = await prisma.roadmap.create({
      data: {
        userId,
        role: desiredRole,
        data: JSON.stringify(roadmapData),
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        type: "ROADMAP_GENERATED",
        title: `Generated ${desiredRole} Roadmap`,
        description: "4-week personalized learning plan created",
        pointsEarned: 10,
      },
    }).catch(() => {});

    return NextResponse.json({ roadmap: roadmapData, roadmapId: saved.id });
  } catch (error) {
    console.error("AI Roadmap error:", error);
    return NextResponse.json({
      roadmap: [
        { week: 1, title: "Fundamentals", description: "Start with the basics.", modules: 3, topics: ["Topic 1", "Topic 2"] },
        { week: 2, title: "Intermediate", description: "Learn more complex stuff.", modules: 4, topics: ["Topic 3", "Topic 4"] },
        { week: 3, title: "Advanced", description: "Master the craft.", modules: 5, topics: ["Topic 5", "Topic 6"] },
        { week: 4, title: "Project", description: "Build something real.", modules: 2, topics: ["Topic 7", "Topic 8"] },
      ],
    });
  }
}

// GET - load the user's most recent roadmap
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const latest = await prisma.roadmap.findFirst({
      where: { userId: session.userId as string },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) return NextResponse.json({ roadmap: null });

    return NextResponse.json({
      roadmap: JSON.parse(latest.data),
      role: latest.role,
      roadmapId: latest.id,
    });
  } catch {
    return NextResponse.json({ roadmap: null });
  }
}
