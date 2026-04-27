import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, title, description, pointsEarned } = await req.json();

    const activity = await prisma.activity.create({
      data: {
        userId: session.userId as string,
        type: type || "GENERAL",
        title: title || "Activity",
        description: description || null,
        pointsEarned: pointsEarned || 0,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Activity POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const activities = await prisma.activity.findMany({
      where: { userId: session.userId as string },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
