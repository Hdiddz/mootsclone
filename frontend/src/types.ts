export type Availability = "available" | "limited" | "busy";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Project-ready";

export type SwipeAction = "pass" | "interest" | "save";

export type NotificationType =
  | "match"
  | "message"
  | "saved"
  | "project"
  | "accepted"
  | "system";

export interface Skill {
  name: string;
  category: string;
  level: SkillLevel;
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  period?: string;
  description: string;
  relatedSkills: string[];
  link?: string;
}

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  campus: string;
  program: string;
  role: string;
  mainSkill: string;
  skills: Skill[];
  profileSummary: string;
  experienceSummary: string;
  experiences: Experience[];
  lookingFor: string[];
  availability: Availability;
  availabilityDetail: string;
  collaborationGoals: string[];
  portfolioLinks: PortfolioLink[];
  preferredRole: string;
  suggestedMessage: string;
  accent: string;
  avatarUrl?: string;
  avatarPosition?: string;
  statusLabel?: string;
  online?: boolean;
  mutualInterest?: boolean;
}

export interface MatchRecord {
  id: string;
  candidateId: string;
  createdAt: string;
  skillOverlap: string[];
  latestMessage: string;
  unread: number;
  summary: string[];
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface ProjectOpportunity {
  id: string;
  title: string;
  summary: string;
  neededRoles: string[];
  skills: string[];
  deadline: string;
  status: string;
}

export interface FilterValues {
  skillCategory: string;
  specificSkill: string;
  role: string;
  availability: string;
  collaborationGoal: string;
  program: string;
  level: string;
}
