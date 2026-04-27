import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const userId = session.userId as string;

    // Search across Jobs, Interviews, and Roadmaps
    const [jobs, interviews, roadmaps] = await Promise.all([
      prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { company: { contains: query, mode: "insensitive" } },
            { skills: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 3,
        select: { id: true, title: true, company: true },
      }),
      prisma.interviewSession.findMany({
        where: {
          userId,
          domain: { contains: query, mode: "insensitive" },
        },
        take: 3,
        select: { id: true, domain: true, createdAt: true },
      }),
      prisma.roadmap.findMany({
        where: {
          userId,
          role: { contains: query, mode: "insensitive" },
        },
        take: 3,
        select: { id: true, role: true },
      }),
    ]);

    const results = [
      ...jobs.map((j: { id: string; title: string; company: string }) => ({
        id: `job-${j.id}`,
        title: j.title,
        subtitle: j.company,
        type: "job",
        link: `/dashboard/jobs?q=${encodeURIComponent(j.title)}`,
      })),
      ...interviews.map((i: { id: string; domain: string; createdAt: Date }) => ({
        id: `int-${i.id}`,
        title: `${i.domain} Interview`,
        subtitle: new Date(i.createdAt).toLocaleDateString(),
        type: "interview",
        link: "/dashboard/interview",
      })),
      ...roadmaps.map((r: { id: string; role: string }) => ({
        id: `rd-${r.id}`,
        title: `${r.role} Roadmap`,
        subtitle: "Saved Skill Plan",
        type: "roadmap",
        link: "/dashboard/roadmap",
      })),
    ];

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
