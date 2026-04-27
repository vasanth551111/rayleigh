import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function calculateStreak(activities: { createdAt: Date }[]): number {
  if (activities.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique days (as date strings) sorted descending
  const days = [
    ...new Set(
      activities.map((a) => {
        const d = new Date(a.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    ),
  ].sort((a, b) => b - a);

  let streak = 0;
  let expectedDay = today.getTime();

  for (const day of days) {
    if (day === expectedDay) {
      streak++;
      expectedDay -= 86400000; // subtract 1 day
    } else if (day < expectedDay) {
      break;
    }
  }

  return streak;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId as string;

    // Get real counts from DB
    const [applicationsCount, interviewsCount, resumeScore, activities, profile, allActivities] = await Promise.all([
      prisma.application.count({ where: { studentId: userId } }),
      prisma.interviewSession.count({ where: { userId } }),
      prisma.resume.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { score: true },
      }),
      prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.profile.findUnique({ where: { userId }, select: { name: true } }),
      // All activities for streak calc
      prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: { createdAt: true },
      }),
    ]);

    // Get today's daily challenge
    const todayChallenge = await prisma.challenge.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // Calculate streak
    const streak = calculateStreak(allActivities);

    // Calculate total points
    const totalPoints = await prisma.activity
      .aggregate({
        where: { userId },
        _sum: { pointsEarned: true },
      })
      .then((r: { _sum: { pointsEarned: number | null } }) => r._sum.pointsEarned ?? 0)
      .catch(() => 0);

    // Format activities; fall back to empty array
    const recentActivity =
      activities.length > 0
        ? activities.map(
            (a: {
              id: string;
              type: string;
              title: string;
              description: string | null;
              createdAt: Date;
            }) => ({
              id: a.id,
              type: a.type.toLowerCase().includes("interview")
                ? "interview"
                : a.type.toLowerCase().includes("application")
                ? "application"
                : "course",
              title: a.title,
              status: a.description || "",
              time: new Date(a.createdAt).toLocaleDateString(),
            })
          )
        : [];

    return NextResponse.json({
      stats: {
        applications: applicationsCount,
        interviews: interviewsCount,
        atsScore: resumeScore?.score || 0,
        streak,
        totalPoints,
      },
      recentActivity,
      challenge: todayChallenge
        ? {
            title: todayChallenge.title,
            description: todayChallenge.description,
            points: todayChallenge.points,
          }
        : { title: "Daily Challenge", description: "Answer 1 Behavioral Question", points: 10 },
      userName: profile?.name || session.name || "there",
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({
      stats: { applications: 0, interviews: 0, atsScore: 0, streak: 0, totalPoints: 0 },
      recentActivity: [],
      challenge: {
        title: "Daily Challenge",
        description: "Answer 1 Behavioral Question",
        points: 10,
      },
      userName: "there",
    });
  }
}
