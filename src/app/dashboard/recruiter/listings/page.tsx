import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Briefcase, Clock, Users } from "lucide-react";
import Link from "next/link";

export default async function RecruiterListingsPage() {
  const session = await getSession();
  if (!session || session.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  const jobs = await prisma.job.findMany({
    where: { recruiterId: session.userId as string },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { matches: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Job Listings</h1>
          <p className="text-muted-foreground text-lg">Manage your active job postings and view candidates.</p>
        </div>
        <Link href="/dashboard/recruiter/post-job" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card className="glass-card flex flex-col items-center justify-center p-12 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <CardTitle className="mb-2">No active listings</CardTitle>
          <CardDescription className="mb-6">You haven't posted any jobs yet.</CardDescription>
          <Link href="/dashboard/recruiter/post-job" className="bg-primary text-white px-6 py-2 rounded-lg font-medium">
            Post your first job
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job: any) => (
            <Card key={job.id} className="glass-card overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <p className="text-primary font-medium">{job.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.remote ? "Remote" : job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2 w-full sm:w-auto">
                  <div className="bg-muted px-4 py-2 rounded-lg flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-bold">{job._count.matches} Candidates</span>
                  </div>
                  <Link href={`/dashboard/recruiter/candidates?jobId=${job.id}`} className="text-sm text-primary hover:underline font-medium">
                    View Matches →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
