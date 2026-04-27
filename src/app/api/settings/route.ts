import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.userId as string;

    let settings = await prisma.settings.findUnique({ where: { userId } });

    if (!settings) {
      // Create default settings for this user on first access
      settings = await prisma.settings.create({
        data: { userId, darkMode: true, emailNotifications: true, marketingEmails: false },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.userId as string;
    const { darkMode, emailNotifications, marketingEmails } = await req.json();

    const settings = await prisma.settings.upsert({
      where: { userId },
      update: { darkMode, emailNotifications, marketingEmails },
      create: { userId, darkMode, emailNotifications, marketingEmails },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
