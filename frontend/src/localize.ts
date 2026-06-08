// Localization helpers (Indonesian/English) extracted from App.tsx.
import { translations, type TranslationSet } from "./translations";
import { mockProjects, roleOptions, collaborationGoalOptions, skillCategories } from "./mockData";
import type { CandidateProfile, NotificationItem, MatchRecord } from "./types";

export function isIndonesian(t: TranslationSet) {
  return t.discover === translations.id.discover;
}

export function localizeStatusLabel(label: string | undefined, t: TranslationSet) {
  if (!label || label === "Open to team up") {
    return "";
  }

  const idLabels: Record<string, string> = {
    "Ready this week": "Siap minggu ini",
    "Weekend backend": "Backend akhir pekan",
    "Pitch ready": "Siap pitching",
    "Limited slots": "Slot terbatas",
    "Lab ready": "Siap di lab",
    "Looking for project": t.lookingForProject,
    "Available this week": t.availableThisWeek,
    "Busy, message first": t.busyMessageFirst
  };

  if (isIndonesian(t)) {
    return idLabels[label] ?? label;
  }

  return label;
}

export function localizeAvailabilityLabel(availability: CandidateProfile["availability"], t: TranslationSet) {
  if (availability === "available") {
    return isIndonesian(t) ? "Tersedia" : "Available";
  }
  if (availability === "limited") {
    return isIndonesian(t) ? "Terbatas" : "Limited";
  }
  return isIndonesian(t) ? "Sibuk" : "Busy";
}

export function localizeNotification(notification: NotificationItem, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return {
      ...notification,
      type:
        notification.type === "match"
          ? "Match"
          : notification.type === "match_request"
            ? "Match Request"
            : notification.type === "message"
              ? "Message"
              : notification.type === "system"
                ? "System"
                : "Project"
    };
  }

  const known: Record<string, Partial<NotificationItem>> = {
    "notif-match-naya": {
      title: "Kecocokan baru dengan Naya",
      body: "Naya adalah UI/UX Designer dengan keahlian Figma, prototyping, dan riset pengguna.",
      time: "5 menit lalu"
    },
    "notif-message-rafi": {
      title: "Rafi mengirim catatan backend",
      body: "Dia bisa membantu menghubungkan frontend Anda ke API Laravel dan data Supabase.",
      time: "1 jam lalu"
    },
    "notif-project-demo": {
      title: "Saran proyek siap",
      body: "Demo Campus Skill Match membutuhkan dukungan desain, backend, dan pitch.",
      time: "Hari ini"
    }
  };

  const type =
    notification.type === "match"
      ? "Kecocokan"
      : notification.type === "match_request"
        ? "Permintaan Kecocokan"
        : notification.type === "message"
          ? "Pesan"
          : notification.type === "system"
            ? "Sistem"
            : "Proyek";
  return { ...notification, type, ...(known[notification.id] ?? {}) };
}

export function localizeProject(project: typeof mockProjects[number], t: TranslationSet) {
  if (!isIndonesian(t)) {
    return project;
  }

  const known: Record<string, Partial<typeof project>> = {
    "project-campus-skill-match": {
      title: "Demo Campus Skill Match",
      summary: "Prototipe untuk mencocokkan mahasiswa berdasarkan keahlian, peran, ketersediaan, dan tujuan kolaborasi.",
      status: "Terbuka",
      deadline: "3 minggu lagi"
    },
    "project-smart-event": {
      title: "Pendamping Smart Event",
      summary: "Asisten acara mobile-first untuk presensi, pengingat, dan koordinasi tim.",
      status: "Merekrut",
      deadline: "2 minggu lagi"
    }
  };

  return { ...project, ...(known[project.id] ?? {}) };
}

export function localizeRoleLabel(role: string, t: Record<string, string>): string {
  if (!isIndonesian(t as unknown as TranslationSet)) {
    return role;
  }

  const roles: Record<string, string> = {
    "Frontend Developer": "Pengembang Frontend",
    "Backend Developer": "Pengembang Backend",
    "UI/UX Designer": "Desainer UI/UX",
    "Product Designer": "Desainer Produk",
    "Business Strategist": "Strategis Bisnis",
    "Data Analyst": "Analis Data",
    "IoT Builder": "Perakit IoT",
    "Content Creator": "Kreator Konten",
    Researcher: "Peneliti",
    "Pitch Deck Writer": "Penulis Pitch Deck",
    Technical: t.technicalRole,
    Business: t.businessRole,
    Design: t.designRole,
    Other: t.otherRole
  };

  return roles[role] ?? role;
}

export function localizeCollaborationGoal(goal: string, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return goal;
  }

  const goals: Record<string, string> = {
    "Competition team": "Tim lomba",
    "Startup prototype": "Prototipe startup",
    "Campus assignment": "Tugas kampus",
    "Research project": "Proyek riset",
    "Organization event": "Acara organisasi",
    "Freelance project": "Proyek freelance",
    "Innovation program": "Program inovasi"
  };

  return goals[goal] ?? goal;
}

export function localizeSkillCategory(category: string, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return category;
  }

  const categories: Record<string, string> = {
    Development: "Pengembangan",
    Design: "Desain",
    Business: "Bisnis",
    Content: "Konten",
    Research: "Riset",
    Data: "Data",
    "Hardware/IoT": "Perangkat Keras/IoT",
    Communication: "Komunikasi",
    Other: "Lainnya"
  };

  return categories[category] ?? category;
}

export function localizeSkillLevel(level: string, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return level;
  }

  const levels: Record<string, string> = {
    Beginner: "Pemula",
    Intermediate: "Menengah",
    Advanced: "Mahir",
    "Project-ready": "Siap proyek"
  };

  return levels[level] ?? level;
}

export function localizeOptionLabel(value: string, t: TranslationSet) {
  if (roleOptions.includes(value)) {
    return localizeRoleLabel(value, t as unknown as Record<string, string>);
  }
  if (collaborationGoalOptions.includes(value)) {
    return localizeCollaborationGoal(value, t);
  }
  if (skillCategories.includes(value)) {
    return localizeSkillCategory(value, t);
  }
  return value;
}

export function localizeFilterValue(key: string, value: string, t: TranslationSet) {
  if (key === "availability") {
    return localizeAvailabilityLabel(value as CandidateProfile["availability"], t);
  }
  if (key === "level") {
    return localizeSkillLevel(value, t);
  }
  return localizeOptionLabel(value, t);
}

export function localizeActionHint(actionHint: string | undefined, t: TranslationSet) {
  if (!actionHint) {
    return "";
  }
  if (actionHint === "Save") {
    return t.saveProfile;
  }
  if (actionHint === "Interested") {
    return t.showInterest;
  }
  if (actionHint === "Pass") {
    return t.passProfile;
  }
  if (actionHint === "Rewind") {
    return isIndonesian(t) ? "Kembali" : "Rewind";
  }
  return actionHint;
}

export function localizeMatchMessage(message: string, t: Record<string, string>): string {
  if (!isIndonesian(t as unknown as TranslationSet)) {
    return message;
  }

  const messages: Record<string, string> = {
    "Your React skills fit my product flow. Want to plan a quick prototype sprint?":
      "Keahlian React Anda cocok dengan alur produk saya. Mau merencanakan sprint prototipe singkat?",
    "I can help connect your React UI to a real Laravel API this weekend.":
      "Saya bisa membantu menghubungkan UI React Anda ke API Laravel nyata akhir pekan ini.",
    "Your prototype can be stronger with a tighter pitch story. Want to team up?":
      "Prototipe Anda bisa lebih kuat dengan cerita pitch yang rapi. Mau bergabung?",
    "I can help turn your user survey into a dashboard for the prototype.":
      "Saya bisa membantu mengubah survei pengguna Anda menjadi dashboard untuk prototipe.",
    "If your project needs a physical demo, I can handle sensors and Arduino.":
      "Jika proyek Anda butuh demo fisik, saya bisa menangani sensor dan Arduino.",
    "I saw your skills and think we could build a strong prototype team. Are you open to discussing roles?":
      "Saya melihat keahlian Anda dan merasa kita bisa membangun tim prototipe yang kuat. Mau membahas peran?",
    "Hey! Thanks for saving my profile. I'd love to chat about collaborating!":
      "Hai! Terima kasih sudah menyimpan profil saya. Saya tertarik membahas kolaborasi!",
    "Hi Hadid, your React prototype work looks relevant. Want to discuss a competition team?":
      "Hai Hadid, karya prototipe React Anda terlihat relevan. Mau membahas tim lomba?"
  };

  return messages[message] ?? message;
}

export function localizeChatMessage(message: string, t: TranslationSet) {
  return localizeMatchMessage(message, t as unknown as Record<string, string>);
}

export function localizeTimeLabel(time: string, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return time;
  }

  const times: Record<string, string> = {
    Today: "Hari ini",
    Yesterday: "Kemarin",
    "Just now": "Baru saja"
  };

  return times[time] ?? time;
}

export function localizeMatchSummary(match: MatchRecord, candidate: CandidateProfile, t: TranslationSet) {
  const safeSummary = Array.isArray(match?.summary) ? match.summary : [];
  if (!isIndonesian(t)) {
    return safeSummary;
  }

  const name = candidate?.name ? String(candidate.name) : "";
  const firstName = name.split(" ")[0] || "";
  const skillsArray = Array.isArray(candidate?.skills) ? candidate.skills : [];
  const firstSkill = skillsArray[0]?.name ?? candidate?.mainSkill ?? "";
  const secondSkill = skillsArray[1]?.name ?? "";
  const skillText = secondSkill ? `${firstSkill} dan ${secondSkill}` : firstSkill;
  
  const goalsArray = Array.isArray(candidate?.collaborationGoals) ? candidate.collaborationGoals : [];
  const goal = goalsArray[0]
    ? localizeCollaborationGoal(goalsArray[0], t).toLowerCase()
    : "proyek";

  const roleText = candidate?.role
    ? localizeRoleLabel(candidate.role, t as unknown as Record<string, string>).toLowerCase()
    : "kolaborator";

  return [
    `Anda mencari dukungan ${roleText}.`,
    `${firstName} punya pengalaman ${skillText || "yang relevan"}.`,
    `Kedua profil menyebut kolaborasi ${goal}.`
  ];
}

export function localizeProfileSummary(profile: CandidateProfile, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return profile.profileSummary;
  }

  const summaries: Record<string, string> = {
    "Frontend-focused student building clean web prototypes for campus innovation, competitions, and fast product demos.":
      "Mahasiswa fokus frontend yang membangun prototipe web rapi untuk inovasi kampus, lomba, dan demo produk cepat.",
    "Designs research-backed mobile and web flows for student product teams.":
      "Merancang alur mobile dan web berbasis riset untuk tim produk mahasiswa.",
    "Builds APIs, auth flows, and deployment-ready backend services for student prototypes.":
      "Membangun API, alur autentikasi, dan layanan backend siap deploy untuk prototipe mahasiswa.",
    "Turns prototype ideas into clear validation plans, pitch decks, and competition stories.":
      "Mengubah ide prototipe menjadi rencana validasi, pitch deck, dan cerita lomba yang jelas.",
    "Creates data dashboards and simple ML baselines for product validation.":
      "Membuat dashboard data dan baseline ML sederhana untuk validasi produk.",
    "Builds sensor prototypes and connects hardware demos to simple web dashboards.":
      "Membangun prototipe sensor dan menghubungkan demo perangkat keras ke dashboard web sederhana."
  };

  return summaries[profile.profileSummary] ?? profile.profileSummary;
}

export function localizeExperienceSummary(profile: CandidateProfile, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return profile.experienceSummary;
  }

  const summaries: Record<string, string> = {
    "Built responsive dashboards, landing pages, and prototype flows for student projects using React and Laravel-ready UI patterns.":
      "Membangun dashboard responsif, landing page, dan alur prototipe untuk proyek mahasiswa memakai pola UI React yang siap Laravel.",
    "Led wireframes, prototypes, and usability testing for a campus marketplace concept.":
      "Memimpin wireframe, prototipe, dan uji kegunaan untuk konsep marketplace kampus.",
    "Implemented REST APIs and database schemas for organization event systems.":
      "Mengimplementasikan REST API dan skema database untuk sistem acara organisasi.",
    "Prepared market research and pitch materials for a campus innovation finalist.":
      "Menyiapkan riset pasar dan materi pitch untuk finalis inovasi kampus.",
    "Built survey analytics and dashboard prototypes for research and competition teams.":
      "Membangun analitik survei dan prototipe dashboard untuk tim riset dan lomba.",
    "Created smart locker and environment monitoring prototypes for campus assignments.":
      "Membuat prototipe smart locker dan pemantauan lingkungan untuk tugas kampus."
  };

  return summaries[profile.experienceSummary] ?? profile.experienceSummary;
}

export function localizeAvailabilityDetail(profile: CandidateProfile, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return profile.availabilityDetail;
  }

  const details: Record<string, string> = {
    "Open for evening and weekend competition work.": "Terbuka untuk kerja lomba pada malam hari dan akhir pekan.",
    "Available on weeknights and Saturday morning.": "Tersedia pada malam hari kerja dan Sabtu pagi.",
    "Can focus on API work during weekends.": "Bisa fokus pada pekerjaan API saat akhir pekan.",
    "Open for evening planning and pitch practice.": "Tersedia untuk perencanaan malam hari dan latihan pitch.",
    "Available for small analytics tasks after exams.": "Tersedia untuk tugas analitik kecil setelah ujian.",
    "Open for lab sessions and weekend demos.": "Terbuka untuk sesi lab dan demo akhir pekan."
  };

  return details[profile.availabilityDetail] ?? profile.availabilityDetail;
}

export function localizePreferredRole(profile: CandidateProfile, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return profile.preferredRole;
  }

  const roles: Record<string, string> = {
    "Frontend owner and UI integrator": "Pemilik frontend dan integrator UI",
    "Design lead and user testing owner": "Pemimpin desain dan penanggung jawab uji pengguna",
    "API owner and database integrator": "Pemilik API dan integrator database",
    "Pitch and validation owner": "Penanggung jawab pitch dan validasi",
    "Analytics and dashboard owner": "Pemilik analitik dan dashboard",
    "Hardware prototype owner": "Pemilik prototipe perangkat keras"
  };

  return roles[profile.preferredRole] ?? profile.preferredRole;
}

export function localizeExperienceText(text: string, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return text;
  }

  const texts: Record<string, string> = {
    "Frontend Developer": "Pengembang Frontend",
    "Campus Innovation Prototype": "Prototipe Inovasi Kampus",
    "Created responsive UI screens, reusable components, and a demo flow for a campus collaboration application.":
      "Membuat layar UI responsif, komponen reusable, dan alur demo untuk aplikasi kolaborasi kampus.",
    "UI/UX Lead": "Lead UI/UX",
    "Campus Marketplace Prototype": "Prototipe Marketplace Kampus",
    "Mapped user flows, produced high-fidelity Figma prototypes, and ran quick usability tests.":
      "Memetakan alur pengguna, membuat prototipe Figma high-fidelity, dan menjalankan uji kegunaan singkat.",
    "Backend Developer": "Pengembang Backend",
    "Event Registration System": "Sistem Pendaftaran Acara",
    "Created role-based APIs, message queues, and deployment scripts for a student event platform.":
      "Membuat API berbasis peran, antrean pesan, dan skrip deploy untuk platform acara mahasiswa.",
    "Business Strategist": "Strategis Bisnis",
    "Innovation Challenge Finalist": "Finalis Tantangan Inovasi",
    "Validated customer segments, shaped the revenue model, and prepared the final pitch narrative.":
      "Memvalidasi segmen pelanggan, membentuk model pendapatan, dan menyiapkan narasi pitch final.",
    "Data Analyst": "Analis Data",
    "Student Research Dashboard": "Dashboard Riset Mahasiswa",
    "Cleaned survey data, visualized insights, and built dashboard screens for decision making.":
      "Membersihkan data survei, memvisualisasikan insight, dan membangun layar dashboard untuk pengambilan keputusan.",
    "IoT Prototype Builder": "Pembuat Prototipe IoT"
  };

  return texts[text] ?? text;
}
