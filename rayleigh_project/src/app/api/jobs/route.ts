import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";
    const location = searchParams.get("location") || "";
    const remote = searchParams.get("remote") === "true";

    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { company: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          type ? { type } : {},
          location ? { location: { contains: location, mode: "insensitive" } } : {},
          remote ? { remote: true } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized. Recruiter only." }, { status: 401 });
    }

    const body = await req.json();
    const { title, company, location, type, salary, description, skills, remote, experienceLevel } = body;

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
        skills,
        remote,
        experienceLevel,
        recruiterId: session.userId as string,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
