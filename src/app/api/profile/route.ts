import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.profile?.bio,
      locationPreference: user.profile?.locationPreference,
      skills: user.profile?.skills,
      experience: user.profile?.experience,
      projects: user.profile?.projects,
      certifications: user.profile?.certifications,
      githubUrl: user.profile?.githubUrl,
      linkedinUrl: user.profile?.linkedinUrl,
      resumeUrl: user.profile?.resumeUrl,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, locationPreference, skills, experience, projects, certifications, githubUrl, linkedinUrl } = body;

    // Update User name
    if (name) {
      await prisma.user.update({
        where: { id: session.userId as string },
        data: { name },
      });
    }

    // Update or create Profile
    const profile = await prisma.profile.upsert({
      where: { userId: session.userId as string },
      update: {
        bio,
        locationPreference,
        skills,
        experience: typeof experience === 'string' ? experience : JSON.stringify(experience),
        projects: typeof projects === 'string' ? projects : JSON.stringify(projects),
        certifications: typeof certifications === 'string' ? certifications : JSON.stringify(certifications),
        githubUrl,
        linkedinUrl,
      },
      create: {
        userId: session.userId as string,
        bio,
        locationPreference,
        skills,
        experience: typeof experience === 'string' ? experience : JSON.stringify(experience),
        projects: typeof projects === 'string' ? projects : JSON.stringify(projects),
        certifications: typeof certifications === 'string' ? certifications : JSON.stringify(certifications),
        githubUrl,
        linkedinUrl,
      },
    });

    return NextResponse.json({ ...profile, name });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
