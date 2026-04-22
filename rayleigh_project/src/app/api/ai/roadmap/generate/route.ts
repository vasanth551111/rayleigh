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

    const { desiredRole, currentSkills, timeAvailable } = await req.json();

    const prompt = `Generate a personalized 4-week learning roadmap for a student who wants to become a ${desiredRole}.
    Current Skills: ${currentSkills}
    Time Available: ${timeAvailable} per week.
    
    Provide a JSON object with a "roadmap" field containing an array of 4 objects, one for each week.
    Each object should have: "week", "title", "description", "modules" (number of modules), and "topics" (array of strings).
    
    Format the output as clean JSON.`;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_key_here") {
      return NextResponse.json({
        roadmap: [
          { week: 1, title: "Foundations & Core Concepts", description: `Build a solid foundation in ${desiredRole} fundamentals.`, modules: 4, topics: ["Introduction to the field", "Key tools and technologies", "Setting up your development environment", "Basic syntax and architecture"] },
          { week: 2, title: "Intermediate Advanced Topics", description: "Deep dive into more complex concepts and integration.", modules: 6, topics: ["State management / Advanced logic", "API integration and data fetching", "Error handling and debugging", "Security best practices"] },
          { week: 3, title: "Specialization & Best Practices", description: "Master the patterns used by industry professionals.", modules: 5, topics: ["Design patterns", "Testing and QA", "Performance optimization", "Deployment strategies"] },
          { week: 4, title: "Capstone Project & Portfolio", description: "Apply everything you've learned to a real-world project.", modules: 3, topics: ["Project planning", "Building the MVP", "Refining and polishing", "Portfolio presentation"] }
        ]
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert career counselor and learning architect." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    const data = JSON.parse(content || "{}");

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI Roadmap error:", error);
    return NextResponse.json({
      roadmap: [
        { week: 1, title: "Fundamentals", description: "Start with the basics.", modules: 3, topics: ["Topic 1", "Topic 2"] },
        { week: 2, title: "Intermediate", description: "Learn more complex stuff.", modules: 4, topics: ["Topic 3", "Topic 4"] },
        { week: 3, title: "Advanced", description: "Master the craft.", modules: 5, topics: ["Topic 5", "Topic 6"] },
        { week: 4, title: "Project", description: "Build something real.", modules: 2, topics: ["Topic 7", "Topic 8"] }
      ]
    });
  }
}
