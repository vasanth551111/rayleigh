import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { resumeUrl } = body;

    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: {
        jobId: id,
        studentId: session.userId as string,
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Already applied to this job" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        jobId: id,
        studentId: session.userId as string,
        resumeUrl,
        status: "APPLIED",
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
