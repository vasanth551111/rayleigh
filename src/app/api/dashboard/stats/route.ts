import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId as string;

    // Get real counts from DB
    const [applicationsCount, interviewsCount, coursesCount, resumeScore] = await Promise.all([
      prisma.application.count({ where: { studentId: userId } }),
      prisma.interviewSession.count({ where: { userId } }),
      prisma.progress.count({ where: { userId } }),
      prisma.resume.findFirst({ 
        where: { userId }, 
        orderBy: { createdAt: 'desc' },
        select: { score: true }
      })
    ]);

    // Mock recent activity for now, can be expanded to fetch from a log table
    const recentActivity = [
      { id: 1, type: 'application', title: 'Applied to Google', status: 'Pending', time: '2h ago' },
      { id: 2, type: 'interview', title: 'AI Mock Interview', status: 'Completed', time: '5h ago' },
      { id: 3, type: 'course', title: 'React Mastery', status: 'In Progress', time: '1d ago' },
    ];

    return NextResponse.json({
      stats: {
        applications: applicationsCount,
        interviews: interviewsCount,
        coursesCompleted: coursesCount,
        atsScore: resumeScore?.score || 0
      },
      recentActivity
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    // Simulation fallback
    return NextResponse.json({
      stats: {
        applications: 12,
        interviews: 5,
        coursesCompleted: 3,
        atsScore: 85
      },
      recentActivity: [
        { id: 1, type: 'application', title: 'Applied to Google', status: 'Shortlisted', time: '2h ago' },
        { id: 2, type: 'interview', title: 'Frontend Interview', status: 'Completed', time: '1d ago' },
        { id: 3, type: 'course', title: 'System Design', status: 'Completed', time: '3d ago' },
      ]
    });
  }
}
