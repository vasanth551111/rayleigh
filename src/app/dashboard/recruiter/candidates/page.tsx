import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, GraduationCap, Code, Globe, Mail } from "lucide-react";
import Link from "next/link";

export default async function CandidatesSearchPage({
  searchParams,
}: {
  searchParams: { jobId?: string; q?: string };
}) {
  const session = await getSession();
  if (!session || session.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  // Find all students, optionally filtering by search query
  const query = searchParams?.q || "";
  
  const candidates = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      profile: {
        isNot: null,
        OR: query ? [
          { skills: { contains: query, mode: "insensitive" } },
          { locationPreference: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ] : undefined,
      }
    },
    include: { profile: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Candidate Search</h1>
        <p className="text-muted-foreground text-lg">Browse through student profiles and find the perfect match.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate: any) => (
          <Card key={candidate.id} className="glass-card flex flex-col h-full hover:border-primary/50 transition-all group">
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{candidate.profile?.name || "Anonymous Student"}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {candidate.profile?.locationPreference || "Location not specified"}
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {candidate.profile?.college && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{candidate.profile.college}</span>
                  </div>
                )}
                
                {candidate.profile?.skills && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Top Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.profile.skills.split(",").slice(0, 4).map((skill: string, i: number) => (
                        <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md border border-border">
                          {skill.trim()}
                        </span>
                      ))}
                      {candidate.profile.skills.split(",").length > 4 && (
                        <span className="text-xs text-muted-foreground px-1 py-1">
                          +{candidate.profile.skills.split(",").length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-border flex items-center justify-between">
                <div className="flex gap-3 text-muted-foreground">
                  {candidate.profile?.github && (
                    <Link href={candidate.profile.github} target="_blank" className="hover:text-primary transition-colors">
                      <Code className="h-5 w-5" />
                    </Link>
                  )}
                  {candidate.profile?.linkedin && (
                    <Link href={candidate.profile.linkedin} target="_blank" className="hover:text-primary transition-colors">
                      <Globe className="h-5 w-5" />
                    </Link>
                  )}
                  <a href={`mailto:${candidate.email}`} className="hover:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
                <button className="text-sm font-medium text-primary hover:underline">
                  View Full Profile
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        {candidates.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No candidates found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
