import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";
    let location = searchParams.get("location") || "";
    let remote = searchParams.get("remote") === "true";

    // Use user's location preference if explicit location is not provided
    if (!location && !remote) {
      const session = await getSession();
      if (session) {
        const user = await prisma.user.findUnique({
          where: { id: session.userId as string },
          include: { profile: true },
        });
        
        const locPref = user?.profile?.locationPreference;
        if (locPref) {
          if (locPref.toLowerCase().includes("remote")) {
            remote = true;
          } else {
            location = locPref;
          }
        }
      }
    }

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
          location ? {
            OR: location.split('|').flatMap(fullLoc => {
              const parts = fullLoc.split(',').map(p => p.trim());
              return parts.map(part => ({
                location: { contains: part, mode: "insensitive" }
              }));
            })
          } : {},
          remote ? { remote: true } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Fetch jobs error:", error);
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
    const { title, company, location, type, salary, description, skills, remote } = body;

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
        postedById: session.userId as string,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
