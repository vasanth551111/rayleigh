const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding jobs...");

  // First, find a recruiter user to "own" these jobs
  let recruiter = await prisma.user.findFirst({
    where: { role: "RECRUITER" }
  });

  if (!recruiter) {
    console.log("No recruiter found, creating one...");
    recruiter = await prisma.user.create({
      data: {
        email: "recruiter@rayleigh.com",
        password: "password123", // In a real app this would be hashed
        name: "Rayleigh Recruiter",
        role: "RECRUITER",
      }
    });
  }

  const jobs = [
    {
      title: "Senior Frontend Engineer",
      company: "TechNova Chennai",
      location: "Chennai, Tamil Nadu, India",
      type: "Full-time",
      salary: "15,00,000 - 25,00,000",
      description: "Join our core team building next-gen AI platforms in the heart of Chennai.",
      skills: "React,Next.js,Tailwind,TypeScript",
      remote: false,
      postedById: recruiter.id,
    },
    {
      title: "React Native Developer",
      company: "Madurai Soft",
      location: "Madurai, Tamil Nadu, India",
      type: "Full-time",
      salary: "8,00,000 - 14,00,000",
      description: "Help us build beautiful mobile experiences for our growing user base in Tamil Nadu.",
      skills: "React Native,Expo,Redux",
      remote: false,
      postedById: recruiter.id,
    },
    {
      title: "Full Stack Developer",
      company: "IndieDev Bengaluru",
      location: "Bengaluru, India",
      type: "Full-time",
      salary: "18,00,000 - 30,00,000",
      description: "Full stack role in a fast-paced Bengaluru startup.",
      skills: "Node.js,React,PostgreSQL",
      remote: false,
      postedById: recruiter.id,
    },
    {
      title: "Remote Web Designer",
      company: "GlobalUI",
      location: "Remote",
      type: "Contract",
      salary: "1,20,000 - 1,80,000",
      description: "Work from anywhere. Designing beautiful web interfaces.",
      skills: "Figma,UI/UX,Tailwind",
      remote: true,
      postedById: recruiter.id,
    },
    {
      title: "Software Engineer",
      company: "Google UK",
      location: "London, UK",
      type: "Full-time",
      salary: "80,000 - 120,000",
      description: "Join Google London to work on YouTube infrastructure.",
      skills: "C++,Go,System Design",
      remote: false,
      postedById: recruiter.id,
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
