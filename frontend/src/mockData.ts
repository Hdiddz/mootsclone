import type {
  CandidateProfile,
  ChatMessage,
  MatchRecord,
  NotificationItem,
  ProjectOpportunity,
  Skill,
  SkillLevel
} from "./types";

const skill = (name: string, category: string, level: SkillLevel): Skill => ({
  name,
  category,
  level
});

export const skillCategories = [
  "Development",
  "Design",
  "Business",
  "Content",
  "Research",
  "Data",
  "Hardware/IoT",
  "Communication",
  "Other"
];

export const roleOptions = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Product Designer",
  "Business Strategist",
  "Data Analyst",
  "IoT Builder",
  "Content Creator",
  "Researcher",
  "Pitch Deck Writer"
];

export const collaborationGoalOptions = [
  "Competition team",
  "Startup prototype",
  "Campus assignment",
  "Research project",
  "Organization event",
  "Freelance project",
  "Innovation program"
];

export const allSkills: Skill[] = [
  skill("React", "Development", "Project-ready"),
  skill("Laravel", "Development", "Advanced"),
  skill("TypeScript", "Development", "Advanced"),
  skill("Tailwind CSS", "Development", "Project-ready"),
  skill("REST API", "Development", "Advanced"),
  skill("Figma", "Design", "Project-ready"),
  skill("Wireframing", "Design", "Advanced"),
  skill("Prototyping", "Design", "Advanced"),
  skill("Design System", "Design", "Intermediate"),
  skill("Pitch Deck", "Business", "Project-ready"),
  skill("Market Research", "Research", "Advanced"),
  skill("Copywriting", "Content", "Advanced"),
  skill("Video Editing", "Content", "Project-ready"),
  skill("Data Visualization", "Data", "Advanced"),
  skill("Python", "Data", "Advanced"),
  skill("Dashboarding", "Data", "Advanced"),
  skill("IoT Prototyping", "Hardware/IoT", "Project-ready"),
  skill("Arduino", "Hardware/IoT", "Advanced"),
  skill("Sensor Integration", "Hardware/IoT", "Advanced"),
  skill("Public Speaking", "Communication", "Advanced"),
  skill("Team Facilitation", "Communication", "Intermediate"),
  skill("MySQL", "Development", "Advanced"),
  skill("Docker", "Development", "Intermediate"),
  skill("Realtime Events", "Development", "Intermediate"),
  skill("User Interview", "Research", "Advanced"),
  skill("Storyboarding", "Content", "Advanced"),
  skill("Business Model", "Business", "Project-ready")
];

export const starterProfile: CandidateProfile = {
  id: "me",
  name: "Hadid Arkan",
  campus: "Telkom University",
  program: "S1 Informatika",
  role: "Frontend Developer",
  mainSkill: "React",
  skills: [
    skill("React", "Development", "Project-ready"),
    skill("TypeScript", "Development", "Advanced"),
    skill("Tailwind CSS", "Development", "Project-ready"),
    skill("Laravel", "Development", "Intermediate"),
    skill("Figma", "Design", "Intermediate")
  ],
  profileSummary:
    "Frontend-focused student building clean web prototypes for campus innovation, competitions, and fast product demos.",
  experienceSummary:
    "Built responsive dashboards, landing pages, and prototype flows for student projects using React and Laravel-ready UI patterns.",
  experiences: [
    {
      id: "me-exp-1",
      title: "Frontend Developer",
      organization: "Campus Innovation Prototype",
      period: "2026",
      description:
        "Created responsive UI screens, reusable components, and a demo flow for a campus collaboration application.",
      relatedSkills: ["React", "TypeScript", "Tailwind CSS"]
    }
  ],
  lookingFor: ["UI/UX Designer", "Backend Developer", "Pitch Deck Writer"],
  availability: "available",
  availabilityDetail: "Open for evening and weekend competition work.",
  collaborationGoals: ["Competition team", "Startup prototype", "Innovation program"],
  portfolioLinks: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "Portfolio", url: "https://example.com/" }
  ],
  preferredRole: "Frontend owner and UI integrator",
  suggestedMessage:
    "I saw your skills and think we could build a strong prototype team. Are you open to discussing roles?",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPDk4pHub8NGPABmj2-xqKPQvhCXXp9oL3wtVphFeA4h-G6751JbmjVdA2LusfwXMQLJEioYWLASijLvIrFgzy-K4b2y5UjlI56N6Pz0kCmDehf9y5j6Oz1hYSaMPJ47h2XWUeTklPEMoz-CBvEMAZtJ0DyeDYmBiTkV4NfBcdVN6rrBXaKSISC9TDP91IUrXZGXcfD__GsRCLQj3oDhiUK_Y30YENnJBlsCJ2sV7Cny_BMz7uTdmO7sPhbpfidcF6NG6274UCaWw",
  avatarPosition: "center 42%",
  statusLabel: "Open to team up",
  accent: "#ffc629",
  online: true,
  mutualInterest: false
};

export const candidates: CandidateProfile[] = [];

export const createMatchFor = (candidate: CandidateProfile): MatchRecord => ({
  id: `match-${candidate.id}`,
  candidateId: candidate.id,
  createdAt: "Just now",
  skillOverlap: candidate.skills.slice(0, 3).map((item) => item.name),
  latestMessage: candidate.suggestedMessage,
  unread: 1,
  summary: [
    `You are looking for ${candidate.role.toLowerCase()} support.`,
    `${candidate.name.split(" ")[0]} has ${candidate.skills
      .slice(0, 2)
      .map((item) => item.name)
      .join(" and ")} experience.`,
    `Both profiles mention ${candidate.collaborationGoals[0].toLowerCase()} collaboration.`
  ]
});

export const mockMatches: MatchRecord[] = [];

export const mockChats: Record<string, ChatMessage[]> = {};

export const mockNotifications: NotificationItem[] = [];

export const mockProjects: ProjectOpportunity[] = [];
