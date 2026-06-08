// Pure data/validation/UI helpers extracted from App.tsx.
import { allSkills, candidates } from "./mockData";
import type { TranslationSet } from "./translations";
import type { CandidateProfile, FilterValues, Skill } from "./types";

export function applyFilters(profiles: CandidateProfile[], filters: FilterValues) {
  const safeProfiles = Array.isArray(profiles) ? profiles : [];
  return safeProfiles.filter((profile) => {
    if (!profile) return false;
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    const collaborationGoals = Array.isArray(profile.collaborationGoals) ? profile.collaborationGoals : [];

    const matchesCategory =
      !filters.skillCategory ||
      skills.some((skillItem) => skillItem && skillItem.category === filters.skillCategory);
    const matchesSkill =
      !filters.specificSkill ||
      profile.mainSkill === filters.specificSkill ||
      skills.some((skillItem) => skillItem && skillItem.name === filters.specificSkill);
    const matchesRole = !filters.role || profile.role === filters.role;
    const matchesAvailability = !filters.availability || profile.availability === filters.availability;
    const matchesGoal =
      !filters.collaborationGoal || collaborationGoals.includes(filters.collaborationGoal);
    const matchesProgram = !filters.program || profile.program === filters.program;
    const matchesLevel =
      !filters.level || skills.some((skillItem) => skillItem && skillItem.level === filters.level);

    return (
      matchesCategory &&
      matchesSkill &&
      matchesRole &&
      matchesAvailability &&
      matchesGoal &&
      matchesProgram &&
      matchesLevel
    );
  });
}

export function groupSkills(skills: Skill[]) {
  return skills.reduce<Record<string, Skill[]>>((groups, skillItem) => {
    if (!groups[skillItem.category]) {
      groups[skillItem.category] = [];
    }
    groups[skillItem.category].push(skillItem);
    return groups;
  }, {});
}

export function uniqueSkills() {
  return Array.from(
    new Set([...allSkills.map((skillItem) => skillItem.name), ...candidates.flatMap((candidate) => candidate.skills.map((skillItem) => skillItem.name))])
  ).sort();
}

export function uniquePrograms() {
  return Array.from(new Set(candidates.map((candidate) => candidate.program))).sort();
}

export function ensureSkillSelected(skills: Skill[], skillName: string) {
  if (!skillName || skills.some((skillItem) => skillItem.name === skillName)) {
    return skills;
  }
  const known = allSkills.find((skillItem) => skillItem.name === skillName);
  return known ? [known, ...skills] : skills;
}

export function validateOnboardingStep(step: number, draft: CandidateProfile, t: TranslationSet) {
  const errors: string[] = [];

  if (step === 0 && !(draft.name || "").trim()) {
    errors.push(t.fullNameRequiredValidation);
  }
  if (step === 1) {
    if (!(draft.campus || "").trim()) {
      errors.push(t.campusRequired);
    }
    if (!(draft.program || "").trim()) {
      errors.push(t.programRequired);
    }
  }
  // Step 2 (role & main skill) is now fully optional — no validation here.
  if (step === 4) {
    if ((draft.profileSummary || "").length > 180) {
      errors.push(t.profileSummaryLimit);
    }
  }
  if (step === 5 && (draft.experienceSummary || "").length > 240) {
    errors.push(t.experienceSummaryLimit);
  }
  if (step === 7) {
    const badLink = (draft.portfolioLinks || []).find((link) => link.url && !isUrlLike(link.url));
    if (badLink) {
      errors.push(`${badLink.label || "Portfolio"} ${t.portfolioUrlInvalid}`);
    }
  }
  if (step === 8 && !draft.availability) {
    errors.push(t.availabilityRequired);
  }

  return errors;
}

export function isOnboardingStepOptional(step: number) {
  return [2, 3, 4, 5, 6, 7, 9].includes(step);
}

export function validateProfile(profile: CandidateProfile) {
  const errors: string[] = [];
  if (!profile.name.trim()) {
    errors.push("Name is required.");
  }
  if (!profile.mainSkill) {
    errors.push("Main skill is required.");
  }
  if (profile.skills.length < 3) {
    errors.push("Select at least 3 skills.");
  }
  return errors;
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getActionHint(x: number, y: number) {
  const horizontal = Math.abs(x);
  const vertical = Math.abs(y);

  if (horizontal < 50 && vertical < 50) {
    return "";
  }
  if (horizontal > vertical && x > 50) {
    return "Pass";
  }
  if (horizontal > vertical && x < -50) {
    return "Rewind";
  }
  return "";
}

export function stripReplyContext(text: string): string {
  const match = text.match(/^(?:Replying to|Membalas) [^:]+: "[\s\S]+?"\n([\s\S]+)$/);
  return match ? match[1] : text;
}

export function isUrlLike(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
