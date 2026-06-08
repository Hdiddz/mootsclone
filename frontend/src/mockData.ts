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

// Telkom University faculties. Selecting one cascades the relevant role and
// skill options in onboarding so the form stays short and relevant.
export const facultyOptions = [
  "Fakultas Teknik Elektro",
  "Fakultas Rekayasa Industri",
  "Fakultas Informatika",
  "Fakultas Industri Kreatif",
  "Fakultas Ekonomi dan Bisnis",
  "Fakultas Komunikasi dan Ilmu Sosial",
  "Fakultas Ilmu Terapan"
];

export const facultyConfig: Record<string, { roles: string[]; skills: Skill[] }> = {
  "Fakultas Teknik Elektro": {
    roles: ["Hardware Engineer", "IoT Builder", "Embedded Systems Engineer", "Robotics Engineer", "Telecommunication Engineer"],
    skills: [
      skill("Embedded Systems", "Hardware/IoT", "Advanced"),
      skill("IoT Prototyping", "Hardware/IoT", "Project-ready"),
      skill("Arduino", "Hardware/IoT", "Advanced"),
      skill("Sensor Integration", "Hardware/IoT", "Advanced"),
      skill("PCB Design", "Hardware/IoT", "Intermediate"),
      skill("Microcontroller", "Hardware/IoT", "Advanced"),
      skill("Signal Processing", "Hardware/IoT", "Intermediate"),
      skill("MATLAB", "Data", "Intermediate"),
      skill("C/C++", "Development", "Advanced")
    ]
  },
  "Fakultas Rekayasa Industri": {
    roles: ["Industrial Engineer", "Supply Chain Analyst", "Project Manager", "Business Analyst", "Operations Specialist"],
    skills: [
      skill("Supply Chain", "Business", "Advanced"),
      skill("Lean Manufacturing", "Business", "Intermediate"),
      skill("Six Sigma", "Business", "Intermediate"),
      skill("Project Management", "Business", "Advanced"),
      skill("Data Analysis", "Data", "Advanced"),
      skill("ERP Systems", "Business", "Intermediate"),
      skill("Logistics", "Business", "Intermediate"),
      skill("Quality Control", "Business", "Intermediate"),
      skill("Storyboarding", "Content", "Intermediate")
    ]
  },
  "Fakultas Informatika": {
    roles: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Mobile Developer", "Data Analyst", "AI/ML Engineer", "DevOps Engineer"],
    skills: [
      skill("React", "Development", "Project-ready"),
      skill("TypeScript", "Development", "Advanced"),
      skill("Node.js", "Development", "Advanced"),
      skill("Laravel", "Development", "Advanced"),
      skill("Python", "Data", "Advanced"),
      skill("Machine Learning", "Data", "Advanced"),
      skill("MySQL", "Development", "Advanced"),
      skill("Docker", "Development", "Intermediate"),
      skill("REST API", "Development", "Advanced"),
      skill("Tailwind CSS", "Development", "Project-ready")
    ]
  },
  "Fakultas Industri Kreatif": {
    roles: ["UI/UX Designer", "Graphic Designer", "Video Editor", "Animator", "Content Creator", "Illustrator", "Product Designer"],
    skills: [
      skill("Figma", "Design", "Project-ready"),
      skill("Video Editing", "Content", "Project-ready"),
      skill("Storyboarding", "Content", "Advanced"),
      skill("Motion Graphics", "Content", "Intermediate"),
      skill("Illustration", "Design", "Advanced"),
      skill("Photoshop", "Design", "Advanced"),
      skill("3D Modeling", "Design", "Intermediate"),
      skill("Branding", "Design", "Intermediate"),
      skill("Prototyping", "Design", "Advanced")
    ]
  },
  "Fakultas Ekonomi dan Bisnis": {
    roles: ["Business Strategist", "Financial Analyst", "Marketing Specialist", "Accountant", "Entrepreneur", "Product Manager"],
    skills: [
      skill("Financial Analysis", "Business", "Advanced"),
      skill("Market Research", "Research", "Advanced"),
      skill("Business Model", "Business", "Project-ready"),
      skill("Digital Marketing", "Business", "Advanced"),
      skill("Accounting", "Business", "Intermediate"),
      skill("Pitch Deck", "Business", "Project-ready"),
      skill("Sales Strategy", "Business", "Intermediate"),
      skill("Excel Modeling", "Data", "Advanced")
    ]
  },
  "Fakultas Komunikasi dan Ilmu Sosial": {
    roles: ["Public Relations", "Content Strategist", "Social Media Manager", "Journalist", "Copywriter", "Event Organizer"],
    skills: [
      skill("Copywriting", "Content", "Advanced"),
      skill("Public Speaking", "Communication", "Advanced"),
      skill("Social Media", "Content", "Advanced"),
      skill("Content Strategy", "Content", "Advanced"),
      skill("Journalism", "Content", "Intermediate"),
      skill("Public Relations", "Communication", "Advanced"),
      skill("Campaign Planning", "Business", "Intermediate"),
      skill("Photography", "Content", "Intermediate")
    ]
  },
  "Fakultas Ilmu Terapan": {
    roles: ["Web Developer", "Network Engineer", "Multimedia Specialist", "Database Administrator", "IT Support"],
    skills: [
      skill("Web Development", "Development", "Advanced"),
      skill("Networking", "Development", "Intermediate"),
      skill("Database", "Development", "Advanced"),
      skill("Multimedia", "Content", "Intermediate"),
      skill("System Administration", "Development", "Intermediate"),
      skill("HTML/CSS", "Development", "Project-ready"),
      skill("PHP", "Development", "Advanced"),
      skill("Video Editing", "Content", "Intermediate")
    ]
  }
};

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
  statusLabel: "",
  accent: "#ffc629",
  online: true,
  mutualInterest: false
};

export const candidates: CandidateProfile[] = [
  {
    id: "naya-prameswari",
    name: "Naya Prameswari",
    campus: "Telkom University",
    program: "S1 Desain Komunikasi Visual",
    role: "UI/UX Designer",
    mainSkill: "Figma",
    skills: [
      skill("Figma", "Design", "Project-ready"),
      skill("Wireframing", "Design", "Advanced"),
      skill("Prototyping", "Design", "Advanced"),
      skill("User Interview", "Research", "Advanced")
    ],
    profileSummary: "Designs research-backed mobile and web flows for student product teams.",
    experienceSummary: "Led wireframes, prototypes, and usability testing for a campus marketplace concept.",
    experiences: [
      {
        id: "naya-exp-1",
        title: "UI/UX Lead",
        organization: "Campus Marketplace Prototype",
        period: "2026",
        description: "Mapped user flows, produced high-fidelity Figma prototypes, and ran quick usability tests.",
        relatedSkills: ["Figma", "User Interview", "Prototyping"]
      }
    ],
    lookingFor: ["Frontend Developer", "Business Strategist"],
    availability: "available",
    availabilityDetail: "Available on weeknights and Saturday morning.",
    collaborationGoals: ["Competition team", "Startup prototype"],
    portfolioLinks: [{ label: "Figma", url: "https://figma.com/" }],
    preferredRole: "Design lead and user testing owner",
    suggestedMessage: "Your React skills fit my product flow. Want to plan a quick prototype sprint?",
    avatarUrl: "/foto-1.jpg",
    avatarPosition: "48% 35%",
    statusLabel: "Ready this week",
    accent: "#ec4899",
    online: true,
    mutualInterest: true
  },
  {
    id: "rafi-mahendra",
    name: "Rafi Mahendra",
    campus: "Telkom University",
    program: "S1 Rekayasa Perangkat Lunak",
    role: "Backend Developer",
    mainSkill: "Laravel",
    skills: [
      skill("Laravel", "Development", "Advanced"),
      skill("REST API", "Development", "Advanced"),
      skill("MySQL", "Development", "Advanced"),
      skill("Docker", "Development", "Intermediate")
    ],
    profileSummary: "Builds APIs, auth flows, and deployment-ready backend services for student prototypes.",
    experienceSummary: "Implemented REST APIs and database schemas for organization event systems.",
    experiences: [
      {
        id: "rafi-exp-1",
        title: "Backend Developer",
        organization: "Event Registration System",
        period: "2025",
        description: "Created role-based APIs, message queues, and deployment scripts for a student event platform.",
        relatedSkills: ["Laravel", "REST API", "Docker"]
      }
    ],
    lookingFor: ["Frontend Developer", "UI/UX Designer"],
    availability: "limited",
    availabilityDetail: "Can focus on API work during weekends.",
    collaborationGoals: ["Startup prototype", "Campus assignment"],
    portfolioLinks: [{ label: "GitHub", url: "https://github.com/" }],
    preferredRole: "API owner and database integrator",
    suggestedMessage: "I can help connect your React UI to a real Laravel API this weekend.",
    avatarUrl: "/foto-2.jpg",
    avatarPosition: "52% 42%",
    statusLabel: "Weekend backend",
    accent: "#3b82f6",
    online: true,
    mutualInterest: true
  },
  {
    id: "alya-putri",
    name: "Alya Putri",
    campus: "Telkom University",
    program: "S1 Manajemen Bisnis Telekomunikasi Informatika",
    role: "Business Strategist",
    mainSkill: "Pitch Deck",
    skills: [
      skill("Pitch Deck", "Business", "Project-ready"),
      skill("Market Research", "Research", "Advanced"),
      skill("Business Model", "Business", "Project-ready"),
      skill("Public Speaking", "Communication", "Advanced")
    ],
    profileSummary: "Turns prototype ideas into clear validation plans, pitch decks, and competition stories.",
    experienceSummary: "Prepared market research and pitch materials for a campus innovation finalist.",
    experiences: [
      {
        id: "alya-exp-1",
        title: "Business Strategist",
        organization: "Innovation Challenge Finalist",
        period: "2026",
        description: "Validated customer segments, shaped the revenue model, and prepared the final pitch narrative.",
        relatedSkills: ["Pitch Deck", "Market Research", "Business Model"]
      }
    ],
    lookingFor: ["Frontend Developer", "UI/UX Designer"],
    availability: "available",
    availabilityDetail: "Open for evening planning and pitch practice.",
    collaborationGoals: ["Competition team", "Innovation program"],
    portfolioLinks: [{ label: "Pitch sample", url: "https://example.com/" }],
    preferredRole: "Pitch and validation owner",
    suggestedMessage: "Your prototype can be stronger with a tighter pitch story. Want to team up?",
    avatarUrl: "/foto-3.jpg",
    avatarPosition: "45% 38%",
    statusLabel: "Pitch ready",
    accent: "#f59e0b",
    online: false,
    mutualInterest: true
  },
  {
    id: "dimas-wicaksono",
    name: "Dimas Wicaksono",
    campus: "Telkom University",
    program: "S1 Data Sains",
    role: "Data Analyst",
    mainSkill: "Python",
    skills: [
      skill("Python", "Data", "Advanced"),
      skill("Data Visualization", "Data", "Advanced"),
      skill("Dashboarding", "Data", "Advanced"),
      skill("Market Research", "Research", "Intermediate")
    ],
    profileSummary: "Creates data dashboards and simple ML baselines for product validation.",
    experienceSummary: "Built survey analytics and dashboard prototypes for research and competition teams.",
    experiences: [
      {
        id: "dimas-exp-1",
        title: "Data Analyst",
        organization: "Student Research Dashboard",
        period: "2025",
        description: "Cleaned survey data, visualized insights, and built dashboard screens for decision making.",
        relatedSkills: ["Python", "Data Visualization", "Dashboarding"]
      }
    ],
    lookingFor: ["Frontend Developer", "Business Strategist"],
    availability: "busy",
    availabilityDetail: "Available for small analytics tasks after exams.",
    collaborationGoals: ["Research project", "Innovation program"],
    portfolioLinks: [{ label: "Notebook", url: "https://example.com/" }],
    preferredRole: "Analytics and dashboard owner",
    suggestedMessage: "I can help turn your user survey into a dashboard for the prototype.",
    avatarUrl: "/foto-4.jpg",
    avatarPosition: "55% 44%",
    statusLabel: "Limited slots",
    accent: "#10b981",
    online: false,
    mutualInterest: true
  },
  {
    id: "satria-nugraha",
    name: "Satria Nugraha",
    campus: "Telkom University",
    program: "S1 Teknik Elektro",
    role: "IoT Builder",
    mainSkill: "IoT Prototyping",
    skills: [
      skill("IoT Prototyping", "Hardware/IoT", "Project-ready"),
      skill("Arduino", "Hardware/IoT", "Advanced"),
      skill("Sensor Integration", "Hardware/IoT", "Advanced"),
      skill("Python", "Data", "Intermediate")
    ],
    profileSummary: "Builds sensor prototypes and connects hardware demos to simple web dashboards.",
    experienceSummary: "Created smart locker and environment monitoring prototypes for campus assignments.",
    experiences: [
      {
        id: "satria-exp-1",
        title: "IoT Prototype Builder",
        organization: "Smart Locker Assignment",
        period: "2026",
        description: "Connected RFID, sensors, and a dashboard proof of concept for secure locker access.",
        relatedSkills: ["IoT Prototyping", "Arduino", "Sensor Integration"]
      }
    ],
    lookingFor: ["Frontend Developer", "Pitch Deck Writer"],
    availability: "available",
    availabilityDetail: "Open for lab sessions and weekend demos.",
    collaborationGoals: ["Campus assignment", "Competition team"],
    portfolioLinks: [{ label: "Demo notes", url: "https://example.com/" }],
    preferredRole: "Hardware prototype owner",
    suggestedMessage: "If your project needs a physical demo, I can handle sensors and Arduino.",
    avatarUrl: "/foto-5.jpg",
    avatarPosition: "50% 47%",
    statusLabel: "Lab ready",
    accent: "#8b5cf6",
    online: true,
    mutualInterest: true
  }
];

export const createMatchFor = (candidate: CandidateProfile): MatchRecord => {
  const role = candidate?.role ? String(candidate.role).toLowerCase() : "";
  const name = candidate?.name ? String(candidate.name) : "";
  const firstName = name.split(" ")[0] || "";
  const skillsArray = Array.isArray(candidate?.skills) ? candidate.skills : [];
  const mainSkillStr = candidate?.mainSkill ? String(candidate.mainSkill) : "";
  const suggestedMessageStr = candidate?.suggestedMessage ? String(candidate.suggestedMessage) : "";
  const goalsArray = Array.isArray(candidate?.collaborationGoals) ? candidate.collaborationGoals : [];
  const goalStr = goalsArray[0] ? String(goalsArray[0]).toLowerCase() : "collaboration";

  return {
    id: `match-${candidate?.id || Date.now()}`,
    candidateId: candidate?.id || "",
    createdAt: "Just now",
    skillOverlap: skillsArray.slice(0, 3).map((item) => item?.name || ""),
    latestMessage: suggestedMessageStr,
    unread: 1,
    summary: [
      `You are looking for ${role || "collaborator"} support.`,
      `${firstName} has ${skillsArray.slice(0, 2).map((item) => item?.name || "").join(" and ") || mainSkillStr || "relevant"} experience.`,
      `Both profiles mention ${goalStr} collaboration.`
    ]
  };
};

export const mockMatches: MatchRecord[] = [
  { ...createMatchFor(candidates[0]), unread: 2, createdAt: "Today" },
  { ...createMatchFor(candidates[1]), unread: 1, createdAt: "Yesterday" }
];

export const mockChats: Record<string, ChatMessage[]> = {
  "match-naya-prameswari": [
    {
      id: "chat-naya-1",
      sender: "them",
      text: "Hi Hadid, your React prototype work looks relevant. Want to discuss a competition team?",
      timestamp: "09:12"
    }
  ],
  "match-rafi-mahendra": [
    {
      id: "chat-rafi-1",
      sender: "them",
      text: "I can help connect your React UI to a real Laravel API this weekend.",
      timestamp: "Yesterday"
    }
  ]
};

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-match-naya",
    type: "match",
    title: "New match with Naya",
    body: "Naya is a UI/UX Designer with Figma, prototyping, and user research skills.",
    time: "5 min ago",
    read: false
  },
  {
    id: "notif-message-rafi",
    type: "message",
    title: "Rafi sent a backend note",
    body: "He can help wire your frontend to Laravel APIs and Supabase-backed data.",
    time: "1 hour ago",
    read: false
  },
  {
    id: "notif-project-demo",
    type: "project",
    title: "Project suggestion ready",
    body: "Campus Skill Match Demo needs design, backend, and pitch support.",
    time: "Today",
    read: true
  }
];

export const mockProjects: ProjectOpportunity[] = [
  {
    id: "project-campus-skill-match",
    title: "Campus Skill Match Demo",
    summary: "A prototype for matching students by skill, role, availability, and collaboration goals.",
    neededRoles: ["UI/UX Designer", "Backend Developer", "Business Strategist"],
    skills: ["Figma", "Laravel", "Pitch Deck"],
    deadline: "3 weeks left",
    status: "Open"
  },
  {
    id: "project-smart-event",
    title: "Smart Event Companion",
    summary: "A mobile-first event assistant for attendance, reminders, and team coordination.",
    neededRoles: ["Frontend Developer", "IoT Builder", "Data Analyst"],
    skills: ["React", "IoT Prototyping", "Dashboarding"],
    deadline: "2 weeks left",
    status: "Recruiting"
  }
];
