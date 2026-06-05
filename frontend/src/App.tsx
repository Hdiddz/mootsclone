import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Briefcase,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  Edit,
  Eye,
  Filter,
  Flag,
  Heart,
  Home,
  Link as LinkIcon,
  Menu,
  MessageCircle,
  MoreVertical,
  QrCode,
  RefreshCw,
  Reply,
  RotateCcw,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Star,
  Trash2,
  Undo2,
  User,
  Users,
  Wifi,
  X,
  LogOut,
  Sparkles
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type PointerEventHandler,
  type ReactNode,
  type SetStateAction
} from "react";
import { createPortal } from "react-dom";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import {
  allSkills,
  candidates,
  collaborationGoalOptions,
  createMatchFor,
  mockChats,
  mockMatches,
  mockNotifications,
  mockProjects,
  roleOptions,
  skillCategories,
  starterProfile
} from "./mockData";
import type {
  CandidateProfile,
  ChatMessage,
  Experience,
  FilterValues,
  MatchRecord,
  NotificationItem,
  PortfolioLink,
  Skill,
  SwipeAction
} from "./types";

type PreviousAction = {
  id: string;
  action: SwipeAction;
  createdMatch: boolean;
};

type ToastMessage = {
  id: string;
  title: string;
  body: string;
};

type SymbioStore = {
  profile: CandidateProfile;
  setProfile: Dispatch<SetStateAction<CandidateProfile>>;
  filters: FilterValues;
  setFilters: Dispatch<SetStateAction<FilterValues>>;
  passedIds: string[];
  interestedIds: string[];
  savedIds: string[];
  matches: MatchRecord[];
  setMatches: Dispatch<SetStateAction<MatchRecord[]>>;
  notifications: NotificationItem[];
  chats: Record<string, ChatMessage[]>;
  setChats: Dispatch<SetStateAction<Record<string, ChatMessage[]>>>;
  toasts: ToastMessage[];
  actOnCandidate: (
    candidate: CandidateProfile,
    action: SwipeAction,
    createdMatch?: boolean
  ) => void;
  rewindLast: () => void;
  resetDeck: () => void;
  clearMatches: () => void;
  removeMatch: (matchId: string) => void;
  removeSaved: (candidateId: string) => void;
  clearFilters: () => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  sendMessage: (matchId: string, text: string) => void;
  addToast: (title: string, body: string) => void;
  user: { name: string; email: string; role?: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  language: "en" | "id";
  setLanguage: (lang: "en" | "id") => void;
};

const defaultFilters: FilterValues = {
  skillCategory: "",
  specificSkill: "",
  role: "",
  availability: "",
  collaborationGoal: "",
  program: "",
  level: ""
};

const candidateLookup = new Map(candidates.map((candidate) => [candidate.id, candidate]));

const navItems = [
  { to: "/discover", label: "Discover", icon: Search },
  { to: "/matches", label: "Matches", icon: Users },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/projects", label: "Projects", icon: Briefcase },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User }
];

const openingPrompts = [
  "I saw your frontend skills. Are you open to joining a competition team?",
  "Your experience looks relevant to my project. Can we discuss roles?",
  "I am building a prototype and need someone with your skill set."
];

const emptyExperience: Experience = {
  id: "draft-exp-1",
  title: "",
  organization: "",
  period: "",
  description: "",
  relatedSkills: [],
  link: ""
};

const translations = {
  en: {
    discover: "Discover",
    matches: "Matches",
    saved: "Saved",
    projects: "Projects",
    alerts: "Alerts",
    profile: "Profile",
    discoverTitle: "Discover collaborators",
    discoverEyebrow: "Discover",
    matchesTitle: "Your Matches",
    matchesEyebrow: "Matches",
    savedTitle: "Saved profiles",
    savedEyebrow: "Bookmarked",
    suggestedProject: "Suggested project",
    explore: "Explore",
    projectsTitle: "Your Projects",
    projectsEyebrow: "Projects",
    alertsTitle: "Notifications",
    alertsEyebrow: "Alerts",
    profileTitle: "Your Profile",
    profileEyebrow: "Profile",
    logout: "Log Out",
    settings: "Settings",
    name: "Name",
    photoUrl: "Profile Photo URL",
    language: "Language",
    indonesian: "Indonesian",
    english: "English",
    save: "Save Changes",
    close: "Close",
    filters: "Filters",
    reset: "Reset demo",
    noCandidates: "No candidates match these filters",
    deckComplete: "Deck complete",
    activeFilters: "Active Filters",
    clearAll: "Clear All",
    chatPrompt: "Chat",
    unreadBadge: "unread",
    verified: "Verified profile",
    settingsTitle: "Edit Profile & Settings",
    cancel: "Cancel",
    campus: "Campus",
    program: "Program Major",
    preferredRole: "Preferred Role",
    mainSkill: "Main Skill",
    bio: "About Me",
    markAllRead: "Mark all read",
    markRead: "Mark read",
    savedDesc: "Bookmarked collaborators for later review.",
    noSavedTitle: "No saved profiles yet",
    noSavedBody: "Use the bookmark action in Discover to collect promising teammates.",
    browseCandidates: "Browse candidates",
    chat: "Chat",
    details: "Details",
    remove: "Remove",
    projectsDesc: "Suggested opportunities that show Mutualizm's future direction.",
    neededRoles: "Needed roles",
    skills: "Skills",
    viewProject: "View project",
    alertsDesc: "Mock updates for matches, messages, and project invitations.",
    notificationDetail: "Notification Details",
    edit: "Edit",
    statsMatches: "Matches",
    statsSaved: "Saved",
    statsSkills: "Skills",
    yourSymbioCard: "Your Mutualizm card",
    noMessagesYet: "No messages yet",
    typeMessage: "Type a message...",
    isTyping: "is typing",
    onlineNow: "Online now",
    offline: "Offline",
    open: "Open",
    send: "Send",
    resetDemo: "Reset demo",
    viewProfile: "View Profile",
    whyMatchWorks: "Why this match works",
    noMatchesYet: "No matches yet",
    noMatchesBody: "Show interest in candidate cards to trigger mock matches.",
    discoverProfiles: "Discover profiles",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    backToHome: "Home",
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    loginSubtitle: "Log in to continue building your network.",
    signupSubtitle: "Join the campus innovation ecosystem.",
    signIn: "Sign In",
    signUp: "Sign Up",
    fullName: "Full Name",
    campusEmail: "Campus Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    orContinueWith: "Or continue with",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    keepSwiping: "Keep swiping",
    sendMessageBtn: "Send message",
    chatFollowed: "Chat Followed",
    noChatUsers: "No users to chat with yet.",
    closePanel: "Close",
    home: "Home",
    logoutTitle: "Are you sure you want to log out?",
    logoutBody: "Choose the account session you want to end. Saved accounts can still be used to log in again.",
    noActiveSession: "No active session.",
    mutualizmUser: "Mutualizm user",
    invalidLogin: "Invalid email or password. Hint: student@telkomuniversity.ac.id & hadidpassword, or use Google SSO.",
    fullNameRequired: "Full name is required.",
    emailUsernameRequired: "Email username is required.",
    passwordMin: "Password must be at least 8 characters.",
    passwordHint: "Must be at least 8 characters.",
    resetToastTitle: "Mock reset link",
    resetToastBody: "A password reset link was sent to your email.",
    teluSso: "Tel-U Student SSO",
    googleAccount: "Google Account",
    authLegalPrefix: "By continuing, you agree to our",
    and: "and",
    landingHow: "How it works",
    landingFeatures: "Features",
    landingOpenApp: "Open App",
    landingHeroEyebrow: "Skill-based campus collaboration",
    landingHeroTitle: "Find teammates by skill, not by random group chats.",
    landingHeroBody: "Mutualizm helps Telkom University students discover collaborators for projects, competitions, and startups through structured, skill-based discovery profile cards.",
    landingStartMatching: "Start Matching",
    landingTryDemo: "Try Demo",
    landingMetricsRoles: "12+ Student Roles",
    landingMetricsSwipe: "Swipe Deck Gesture",
    landingMetricsChats: "Mock Matches & Chats",
    landingHowTitle: "From profile to teammate in a few taps.",
    landingStepProfileTitle: "Create Profile",
    landingStepProfileBody: "Showcase your top skills and availability to stand out.",
    landingStepSwipeTitle: "Swipe by Skill",
    landingStepSwipeBody: "Discover peers with complementary abilities for your next big idea.",
    landingStepBuildTitle: "Build Together",
    landingStepBuildBody: "Match instantly and start collaborating on impactful projects.",
    landingFeaturesTitle: "Mutualizm's core features.",
    landingFeatureDiscover: "Discover by skill, role, and availability.",
    landingFeatureSwipe: "Swipe deck with pass, save, and interest animations.",
    landingFeatureChat: "Chat mockup for discussing with matches.",
    landingFeatureSettings: "Profile, language, notification, and privacy settings.",
    landingCtaTitle: "Ready to try Mutualizm?",
    landingCtaBody: "Start from onboarding or jump straight into the discovery deck.",
    landingOpenDiscover: "Open Discover",
    settingsDrawerTitle: "Profile, Language, and Preferences",
    settingsRulesTitle: "Profile rules",
    settingsRulesBody: "Use real information, show your main skill, and keep your experience short so match suggestions stay accurate.",
    profilePhoto: "Profile photo",
    roleMain: "Main role",
    statusBadge: "Status badge",
    defaultStatus: "Default status",
    lookingForProject: "Looking for project",
    availableThisWeek: "Available this week",
    busyMessageFirst: "Busy, message first",
    websiteLanguage: "Website language",
    aboutProfile: "About profile",
    currentPassword: "Current password",
    optionalDemo: "Optional for frontend demo",
    newPassword: "New password",
    confirmNewPassword: "Confirm new password",
    passwordNewMinError: "New password must be at least 8 characters.",
    passwordConfirmError: "Password confirmation does not match.",
    settingsSavedTitle: "Settings saved",
    settingsSavedBody: "Profile and language changes have been saved.",
    deleteAccountConfirm: "Delete this demo account? Local profile data will be removed.",
    notifyPreference: "Show match and new message notifications",
    chatPreference: "Allow followed users to start a chat",
    emailPreference: "Hide campus email from public profile",
    logoutAccount: "Log out account",
    deleteAccount: "Delete account",
    qrTitle: "Scan Profile",
    qrBody: "This QR opens the profile information page for",
    copyLink: "Copy link",
    openProfile: "Open profile",
    linkCopiedTitle: "Profile link copied",
    linkCopiedBody: "Profile link has been copied.",
    realTimeUi: "Realtime UI",
    ready: "Ready",
    rightRailBody: "Online badges, typing indicators, match toasts, and unread counts are mocked for a future Laravel Reverb connection.",
    recentMatches: "Recent matches",
    view: "View",
    unreadCount: "unread",
    clearMatches: "Clear matches",
    matchActions: "Match actions",
    removeMatch: "Remove match",
    reportUser: "Report user",
    blockUser: "Block user",
    matchRemovedTitle: "Match removed",
    matchRemovedBody: "The match and its conversation were removed.",
    reportQueuedTitle: "Report noted",
    reportQueuedBody: "This prototype records the action locally for now.",
    blockQueuedTitle: "Block noted",
    blockQueuedBody: "This prototype records the action locally for now.",
    replyMessage: "Reply",
    deleteMessage: "Delete",
    undoMessage: "Undo",
    copyMessage: "Copy",
    editMessage: "Edit",
    messageCopiedTitle: "Message copied",
    messageCopiedBody: "The message text was copied.",
    messageDeletedTitle: "Message deleted",
    messageDeletedBody: "The message was removed from this conversation.",
    messageUpdatedTitle: "Message updated",
    messageUpdatedBody: "Your edited message was saved.",
    noMessageToUndo: "No message to undo",
    noMessageToUndoBody: "Send a message first, then undo it from here.",
    replyingTo: "Replying to",
    editingMessage: "Editing message",
    chatPreview: "Chat preview",
    conversationWith: "Conversation with",
    conversationNotFound: "Conversation not found.",
    noChatSelected: "No chat selected",
    noChatSelectedBody: "Open a match to preview the conversation UI.",
    viewMatches: "View matches",
    savedChatStarter: "Hey! Thanks for saving my profile. I'd love to chat about collaborating!",
    statusCollaboration: "Collaboration status",
    noAvailabilityDetail: "No availability detail yet.",
    mainSkillsTitle: "Main skills",
    noSkillsYet: "No skills yet.",
    lookingForTitle: "Looking for",
    noLookingForYet: "No team needs selected yet.",
    experienceTitle: "Experience",
    recent: "Recent",
    noExperienceYet: "No experience yet.",
    portfolioTitle: "Portfolio",
    noPortfolioYet: "No portfolio link yet.",
    aiAssistantTitle: "Mutualizm AI",
    aiAssistantIntro: "Ask for teammate suggestions, skill fit, role ideas, or project search help.",
    aiPlaceholder: "Ask what skills or teammate role you need...",
    aiFindDesign: "Find UI/UX support",
    aiFindBackend: "Find backend help",
    aiFindPitch: "Find pitch deck teammate",
    aiAsk: "Ask AI",
    aiThinking: "Finding useful suggestions...",
    aiMatches: "Suggested people",
    aiNoMatches: "No strong local match yet. Try a more specific skill.",
    aiError: "Sorry, the AI assistant could not respond right now.",
    matchReadyCopy: "These collaborators are ready to meet you. Open a card to start a focused project conversation.",
    removeAllSaved: "Remove all saved",
    upload: "Upload",
    noPhoto: "No photo",
    horizontalCrop: "Horizontal crop",
    verticalCrop: "Vertical crop",
    centerCrop: "Center crop",
    pastePhotoUrl: "or paste a photo URL",
    yourName: "Your name",
    mainRoleFallback: "Main role",
    interest: "Interest",
    openCollaboration: "Open collaboration",
    lessInfo: "Less Info",
    moreInfo: "More Info",
    topSkills: "Top Skills",
    lookingForPrefix: "Looking for",
    collaborators: "Collaborators",
    passProfile: "Pass profile",
    saveProfile: "Save profile",
    showInterest: "Show interest",
    fullSummary: "Full summary",
    skillsByCategory: "Skills by category",
    experienceTimeline: "Experience timeline",
    portfolioLinks: "Portfolio links",
    collaborationFit: "Collaboration fit",
    noExperienceProof: "No experience proof yet. Add project evidence from Profile.",
    portfolioCanBeAdded: "Portfolio links can be added later.",
    preferredRoleLabel: "Preferred role",
    availabilityLabel: "Availability",
    suggestedOpener: "Suggested opener"
    ,
    skipToDemo: "Skip to demo",
    stepOf: "Step",
    of: "of",
    profileReadyTitle: "Profile ready",
    profileReadyBody: "Your mock profile is saved for the demo.",
    back: "Back",
    continue: "Continue",
    enterDiscover: "Enter Discover",
    liveCardPreview: "Live card preview",
    stepIdentity: "Identity",
    stepCampus: "Campus",
    stepRole: "Role",
    stepSkills: "Skills",
    stepSummary: "Summary",
    stepExperience: "Experience",
    stepTimeline: "Timeline",
    stepPortfolio: "Portfolio",
    stepAvailability: "Availability",
    stepPreview: "Preview",
    avatarColor: "Avatar color",
    referenceYellow: "Reference yellow",
    softHoney: "Soft honey",
    warmCream: "Warm cream",
    neutralGray: "Neutral gray",
    facultyProgram: "Faculty / program",
    mainRole: "Main Role",
    technicalRole: "Technical",
    businessRole: "Business",
    designRole: "Design",
    otherRole: "Other",
    customRole: "Custom role",
    customRolePlaceholder: "e.g. Data Storyteller, Game Artist, Research Writer",
    mainSkillLabel: "Main skill",
    otherSkill: "Other skill",
    customMainSkill: "Custom main skill",
    customMainSkillPlaceholder: "e.g. Motion Design, Public Speaking, GIS Mapping",
    collaborationType: "Collaboration type",
    skillHelper: "Select at least three skills. The first three appear on the card front.",
    profileSummaryLabel: "Profile summary",
    profileSummaryHint: "characters",
    profileSummaryPlaceholder: "Frontend-focused student experienced in React, Laravel-ready UI, and campus innovation prototypes.",
    experienceSummaryLabel: "Experience summary",
    experienceSummaryHint: "characters. Keep it proof-oriented.",
    experienceSummaryPlaceholder: "Built responsive frontend components for a campus lost-and-found prototype using React and Laravel-ready UI patterns.",
    availabilityDetails: "Availability details",
    availabilityPlaceholder: "Open after class and on weekends for competition work.",
    lookingForLabel: "Looking for",
    suggestedFirstMessage: "Suggested first message",
    suggestedFirstMessagePlaceholder: "I saw your skills and think we could build a strong team. Are you open to discussing roles?",
    additionalSkills: "Additional skills",
    addCustom: "Add custom",
    add: "Add",
    addSkill: "Add skill",
    titleRole: "Title / role",
    projectOrganization: "Project / organization",
    period: "Period",
    description: "Description",
    relatedSkills: "Related skills",
    labelField: "Label",
    urlField: "URL",
    urlWarning: "Use a full URL starting with http or https.",
    fullNameRequiredValidation: "Full name is required.",
    campusRequired: "Campus is required.",
    programRequired: "Faculty or program is required.",
    mainRoleRequired: "Main role is required.",
    mainSkillRequired: "Main skill is required.",
    collaborationTypeRequired: "Select at least one collaboration type.",
    skillRequired: "Select at least 3 skills.",
    profileSummaryLimit: "Profile summary must stay under 180 characters.",
    experienceSummaryLimit: "Experience summary must stay under 240 characters.",
    experienceTitleRequired: "Experience title is required.",
    projectRequired: "Project or organization is required.",
    experienceDescriptionRequired: "Experience description is required.",
    portfolioUrlInvalid: "URL should start with http or https.",
    availabilityRequired: "Availability is required.",
    lookingForRequired: "Select at least one role you are looking for.",
    matchEyebrow: "It is a Mutualizm match",
    matchTitlePrefix: "You and",
    matchTitleSuffix: "are both interested in collaborating.",
    suggestionMatch: "Suggestion match",
    suggestionTitleSuffix: "matches your onboarding profile.",
    whySuggested: "Why suggested",
    skillCategory: "Skill category",
    anyCategory: "Any category",
    specificSkill: "Specific skill",
    anySkill: "Any skill",
    role: "Role",
    anyRole: "Any role",
    anyAvailability: "Any availability",
    collaborationGoal: "Collaboration goal",
    anyGoal: "Any goal",
    anyProgram: "Any program",
    experienceLevel: "Experience level",
    anyLevel: "Any level",
    applyFilters: "Apply filters"
  },
  id: {
    discover: "Temukan",
    matches: "Kecocokan",
    saved: "Disimpan",
    projects: "Proyek",
    alerts: "Notifikasi",
    profile: "Profil",
    discoverTitle: "Temukan kolaborator",
    discoverEyebrow: "Temukan",
    matchesTitle: "Kecocokan Anda",
    matchesEyebrow: "Kecocokan",
    savedTitle: "Profil disimpan",
    savedEyebrow: "Disimpan",
    suggestedProject: "Proyek disarankan",
    explore: "Jelajahi",
    projectsTitle: "Proyek Anda",
    projectsEyebrow: "Proyek",
    alertsTitle: "Notifikasi",
    alertsEyebrow: "Notifikasi",
    profileTitle: "Profil Anda",
    profileEyebrow: "Profil",
    logout: "Keluar",
    settings: "Pengaturan",
    name: "Nama",
    photoUrl: "URL Foto Profil",
    language: "Bahasa",
    indonesian: "Bahasa Indonesia",
    english: "Bahasa Inggris",
    save: "Simpan Perubahan",
    close: "Tutup",
    filters: "Filter",
    reset: "Mulai ulang demo",
    noCandidates: "Tidak ada kandidat yang cocok dengan filter",
    deckComplete: "Dek selesai",
    activeFilters: "Filter Aktif",
    clearAll: "Hapus Semua",
    chatPrompt: "Obrolan",
    unreadBadge: "belum dibaca",
    verified: "Profil terverifikasi",
    settingsTitle: "Ubah Profil & Pengaturan",
    cancel: "Batal",
    campus: "Kampus",
    program: "Program Studi",
    preferredRole: "Peran Pilihan",
    mainSkill: "Keahlian Utama",
    bio: "Tentang Saya",
    markAllRead: "Tandai semua dibaca",
    markRead: "Tandai dibaca",
    savedDesc: "Kolaborator yang disimpan untuk ditinjau nanti.",
    noSavedTitle: "Belum ada profil disimpan",
    noSavedBody: "Gunakan tindakan bookmark di Temukan untuk mengumpulkan rekan tim potensial.",
    browseCandidates: "Telusuri kandidat",
    chat: "Obrolan",
    details: "Detail",
    remove: "Hapus",
    projectsDesc: "Peluang yang disarankan untuk menunjukkan arah masa depan Mutualizm.",
    neededRoles: "Peran yang dibutuhkan",
    skills: "Keahlian",
    viewProject: "Lihat proyek",
    alertsDesc: "Pembaruan simulasi untuk kecocokan, pesan, dan undangan proyek.",
    notificationDetail: "Detail Notifikasi",
    edit: "Ubah",
    statsMatches: "Kecocokan",
    statsSaved: "Disimpan",
    statsSkills: "Keahlian",
    yourSymbioCard: "Kartu Mutualizm Anda",
    noMessagesYet: "Belum ada pesan",
    typeMessage: "Ketik pesan...",
    isTyping: "sedang mengetik",
    onlineNow: "Online sekarang",
    offline: "Offline",
    open: "Buka",
    send: "Kirim",
    resetDemo: "Mulai ulang demo",
    viewProfile: "Lihat Profil",
    whyMatchWorks: "Mengapa kecocokan ini berhasil",
    noMatchesYet: "Belum ada kecocokan",
    noMatchesBody: "Tunjukkan minat pada kartu kandidat untuk memicu kecocokan demo.",
    discoverProfiles: "Temukan profil",
    termsOfService: "Syarat dan Ketentuan",
    privacyPolicy: "Kebijakan Privasi",
    backToHome: "Beranda",
    welcomeBack: "Selamat Datang Kembali",
    createAccount: "Buat Akun",
    loginSubtitle: "Masuk untuk melanjutkan membangun jaringan Anda.",
    signupSubtitle: "Bergabung dengan ekosistem inovasi kampus.",
    signIn: "Masuk",
    signUp: "Daftar",
    fullName: "Nama Lengkap",
    campusEmail: "Email Kampus",
    password: "Kata Sandi",
    forgotPassword: "Lupa kata sandi?",
    orContinueWith: "Atau lanjutkan dengan",
    dontHaveAccount: "Belum punya akun?",
    alreadyHaveAccount: "Sudah punya akun?",
    keepSwiping: "Lanjut swipe",
    sendMessageBtn: "Kirim pesan",
    chatFollowed: "Obrolan Diikuti",
    noChatUsers: "Belum ada pengguna yang bisa diajak mengobrol.",
    closePanel: "Tutup",
    home: "Beranda",
    logoutTitle: "Yakin ingin keluar?",
    logoutBody: "Pilih sesi akun yang ingin dikeluarkan. Akun yang tersimpan tetap bisa dipakai masuk lagi.",
    noActiveSession: "Tidak ada sesi aktif.",
    mutualizmUser: "Pengguna Mutualizm",
    invalidLogin: "Email atau kata sandi tidak valid. Petunjuk: student@telkomuniversity.ac.id & hadidpassword, atau gunakan Google SSO.",
    fullNameRequired: "Nama lengkap wajib diisi.",
    emailUsernameRequired: "Username email wajib diisi.",
    passwordMin: "Kata sandi minimal 8 karakter.",
    passwordHint: "Minimal 8 karakter.",
    resetToastTitle: "Link reset demo",
    resetToastBody: "Link reset kata sandi sudah dikirim ke email Anda.",
    teluSso: "SSO Mahasiswa Tel-U",
    googleAccount: "Akun Google",
    authLegalPrefix: "Dengan melanjutkan, Anda menyetujui",
    and: "dan",
    landingHow: "Cara kerja",
    landingFeatures: "Fitur",
    landingOpenApp: "Buka Aplikasi",
    landingHeroEyebrow: "Kolaborasi kampus berbasis keahlian",
    landingHeroTitle: "Temukan rekan tim berdasarkan keahlian, bukan dari grup acak.",
    landingHeroBody: "Mutualizm membantu mahasiswa Telkom University menemukan kolaborator untuk proyek, kompetisi, dan startup melalui kartu profil berbasis keahlian yang terstruktur.",
    landingStartMatching: "Mulai Mencari",
    landingTryDemo: "Coba Demo",
    landingMetricsRoles: "12+ Peran Mahasiswa",
    landingMetricsSwipe: "Gesture Kartu Swipe",
    landingMetricsChats: "Kecocokan & Obrolan Demo",
    landingHowTitle: "Dari profil ke rekan tim dalam beberapa ketukan.",
    landingStepProfileTitle: "Buat Profil",
    landingStepProfileBody: "Tampilkan keahlian utama dan ketersediaan agar lebih mudah ditemukan.",
    landingStepSwipeTitle: "Geser Berdasarkan Keahlian",
    landingStepSwipeBody: "Temukan teman dengan kemampuan pelengkap untuk ide besar berikutnya.",
    landingStepBuildTitle: "Bangun Bersama",
    landingStepBuildBody: "Dapatkan kecocokan dan mulai berkolaborasi pada proyek berdampak.",
    landingFeaturesTitle: "Fitur utama Mutualizm.",
    landingFeatureDiscover: "Temukan berdasarkan keahlian, peran, dan ketersediaan.",
    landingFeatureSwipe: "Kartu geser dengan animasi lewati, simpan, dan minat.",
    landingFeatureChat: "Mockup obrolan untuk berdiskusi dengan kecocokan.",
    landingFeatureSettings: "Pengaturan profil, bahasa, notifikasi, dan privasi.",
    landingCtaTitle: "Siap mencoba Mutualizm?",
    landingCtaBody: "Mulai dari onboarding atau langsung masuk ke dek penemuan.",
    landingOpenDiscover: "Buka Temukan",
    settingsDrawerTitle: "Profil, Bahasa, dan Preferensi",
    settingsRulesTitle: "Aturan profil",
    settingsRulesBody: "Gunakan informasi asli, tampilkan keahlian utama, dan tulis pengalaman singkat agar saran kecocokan lebih akurat.",
    profilePhoto: "Foto profil",
    roleMain: "Peran utama",
    statusBadge: "Badge status",
    defaultStatus: "Status bawaan",
    lookingForProject: "Mencari proyek",
    availableThisWeek: "Tersedia minggu ini",
    busyMessageFirst: "Sibuk, kirim pesan dulu",
    websiteLanguage: "Bahasa website",
    aboutProfile: "Tentang profil",
    currentPassword: "Kata sandi saat ini",
    optionalDemo: "Opsional untuk demo frontend",
    newPassword: "Kata sandi baru",
    confirmNewPassword: "Konfirmasi kata sandi baru",
    passwordNewMinError: "Kata sandi baru minimal 8 karakter.",
    passwordConfirmError: "Konfirmasi kata sandi belum sama.",
    settingsSavedTitle: "Pengaturan disimpan",
    settingsSavedBody: "Perubahan profil dan bahasa sudah disimpan.",
    deleteAccountConfirm: "Hapus akun demo ini? Data profil lokal akan dihapus.",
    notifyPreference: "Tampilkan notifikasi kecocokan dan pesan baru",
    chatPreference: "Izinkan pengguna yang diikuti memulai obrolan",
    emailPreference: "Sembunyikan email kampus dari profil publik",
    logoutAccount: "Keluar akun",
    deleteAccount: "Hapus akun",
    qrTitle: "Pindai Profil",
    qrBody: "QR ini membuka halaman info profil untuk",
    copyLink: "Salin link",
    openProfile: "Buka profil",
    linkCopiedTitle: "Link profil disalin",
    linkCopiedBody: "Link profil sudah disalin.",
    realTimeUi: "UI realtime",
    ready: "Siap",
    rightRailBody: "Lencana online, indikator mengetik, notifikasi kecocokan, dan jumlah pesan belum dibaca disimulasikan untuk koneksi Laravel Reverb di masa depan.",
    recentMatches: "Kecocokan terbaru",
    view: "Lihat",
    unreadCount: "belum dibaca",
    clearMatches: "Hapus kecocokan",
    matchActions: "Aksi kecocokan",
    removeMatch: "Hapus kecocokan",
    reportUser: "Laporkan pengguna",
    blockUser: "Blokir pengguna",
    matchRemovedTitle: "Kecocokan dihapus",
    matchRemovedBody: "Kecocokan dan percakapannya sudah dihapus.",
    reportQueuedTitle: "Laporan dicatat",
    reportQueuedBody: "Prototype ini mencatat aksi secara lokal untuk saat ini.",
    blockQueuedTitle: "Blokir dicatat",
    blockQueuedBody: "Prototype ini mencatat aksi secara lokal untuk saat ini.",
    replyMessage: "Balas",
    deleteMessage: "Hapus",
    undoMessage: "Urungkan",
    copyMessage: "Salin",
    editMessage: "Ubah",
    messageCopiedTitle: "Pesan disalin",
    messageCopiedBody: "Teks pesan sudah disalin.",
    messageDeletedTitle: "Pesan dihapus",
    messageDeletedBody: "Pesan sudah dihapus dari percakapan ini.",
    messageUpdatedTitle: "Pesan diperbarui",
    messageUpdatedBody: "Pesan yang diubah sudah disimpan.",
    noMessageToUndo: "Belum ada pesan untuk diurungkan",
    noMessageToUndoBody: "Kirim pesan dulu, lalu urungkan dari sini.",
    replyingTo: "Membalas",
    editingMessage: "Mengubah pesan",
    chatPreview: "Pratinjau obrolan",
    conversationWith: "Obrolan dengan",
    conversationNotFound: "Obrolan tidak ditemukan.",
    noChatSelected: "Belum ada obrolan dipilih",
    noChatSelectedBody: "Buka kecocokan untuk melihat pratinjau UI obrolan.",
    viewMatches: "Lihat kecocokan",
    savedChatStarter: "Hai! Terima kasih sudah menyimpan profil saya. Saya tertarik membahas kolaborasi!",
    statusCollaboration: "Status kolaborasi",
    noAvailabilityDetail: "Belum ada detail ketersediaan.",
    mainSkillsTitle: "Keahlian utama",
    noSkillsYet: "Belum ada keahlian.",
    lookingForTitle: "Mencari",
    noLookingForYet: "Belum memilih kebutuhan tim.",
    experienceTitle: "Pengalaman",
    recent: "Terbaru",
    noExperienceYet: "Belum ada pengalaman.",
    portfolioTitle: "Portofolio",
    noPortfolioYet: "Belum ada link portofolio.",
    aiAssistantTitle: "AI Mutualizm",
    aiAssistantIntro: "Minta saran rekan tim, kecocokan skill, ide peran, atau bantuan mencari proyek.",
    aiPlaceholder: "Tanyakan skill atau peran rekan tim yang dibutuhkan...",
    aiFindDesign: "Cari bantuan UI/UX",
    aiFindBackend: "Cari bantuan backend",
    aiFindPitch: "Cari rekan pitch deck",
    aiAsk: "Tanya AI",
    aiThinking: "Mencari saran yang berguna...",
    aiMatches: "Orang yang disarankan",
    aiNoMatches: "Belum ada kecocokan lokal yang kuat. Coba skill yang lebih spesifik.",
    aiError: "Maaf, asisten AI belum bisa menjawab sekarang.",
    matchReadyCopy: "Kolaborator ini siap bertemu dengan Anda. Buka kartu untuk memulai percakapan proyek terarah.",
    removeAllSaved: "Hapus semua simpanan",
    upload: "Unggah",
    noPhoto: "Belum ada foto",
    horizontalCrop: "Posisi horizontal",
    verticalCrop: "Posisi vertikal",
    centerCrop: "Tengahkan foto",
    pastePhotoUrl: "atau tempel URL foto",
    yourName: "Nama Anda",
    mainRoleFallback: "Peran utama",
    interest: "Minat",
    openCollaboration: "Terbuka untuk kolaborasi",
    lessInfo: "Lebih Sedikit",
    moreInfo: "Info Lengkap",
    topSkills: "Keahlian Teratas",
    lookingForPrefix: "Mencari",
    collaborators: "Kolaborator",
    passProfile: "Lewati profil",
    saveProfile: "Simpan profil",
    showInterest: "Tunjukkan minat",
    fullSummary: "Ringkasan lengkap",
    skillsByCategory: "Keahlian per kategori",
    experienceTimeline: "Linimasa pengalaman",
    portfolioLinks: "Link portofolio",
    collaborationFit: "Kecocokan kolaborasi",
    noExperienceProof: "Belum ada bukti pengalaman. Tambahkan bukti proyek dari Profil.",
    portfolioCanBeAdded: "Link portofolio bisa ditambahkan nanti.",
    preferredRoleLabel: "Peran pilihan",
    availabilityLabel: "Ketersediaan",
    suggestedOpener: "Pembuka yang disarankan"
    ,
    skipToDemo: "Lewati ke demo",
    stepOf: "Langkah",
    of: "dari",
    profileReadyTitle: "Profil siap",
    profileReadyBody: "Profil demo Anda sudah disimpan.",
    back: "Kembali",
    continue: "Lanjut",
    enterDiscover: "Masuk Temukan",
    liveCardPreview: "Pratinjau kartu langsung",
    stepIdentity: "Identitas",
    stepCampus: "Kampus",
    stepRole: "Peran",
    stepSkills: "Keahlian",
    stepSummary: "Ringkasan",
    stepExperience: "Pengalaman",
    stepTimeline: "Linimasa",
    stepPortfolio: "Portofolio",
    stepAvailability: "Ketersediaan",
    stepPreview: "Pratinjau",
    avatarColor: "Warna avatar",
    referenceYellow: "Kuning acuan",
    softHoney: "Madu lembut",
    warmCream: "Krem hangat",
    neutralGray: "Abu-abu netral",
    facultyProgram: "Fakultas / program studi",
    mainRole: "Peran Utama",
    technicalRole: "Teknis",
    businessRole: "Bisnis",
    designRole: "Desain",
    otherRole: "Lainnya",
    customRole: "Peran khusus",
    customRolePlaceholder: "mis. Pencerita Data, Seniman Gim, Penulis Riset",
    mainSkillLabel: "Keahlian utama",
    otherSkill: "Keahlian lainnya",
    customMainSkill: "Keahlian utama khusus",
    customMainSkillPlaceholder: "mis. Desain Gerak, Berbicara Publik, Pemetaan GIS",
    collaborationType: "Jenis kolaborasi",
    skillHelper: "Pilih minimal tiga keahlian. Tiga pertama tampil di bagian depan kartu.",
    profileSummaryLabel: "Ringkasan profil",
    profileSummaryHint: "karakter",
    profileSummaryPlaceholder: "Mahasiswa fokus frontend yang berpengalaman dengan React, UI siap Laravel, dan prototipe inovasi kampus.",
    experienceSummaryLabel: "Ringkasan pengalaman",
    experienceSummaryHint: "karakter. Buat tetap berbasis bukti.",
    experienceSummaryPlaceholder: "Membangun komponen frontend responsif untuk prototipe kampus menggunakan React dan pola UI siap Laravel.",
    availabilityDetails: "Detail ketersediaan",
    availabilityPlaceholder: "Tersedia setelah kelas dan akhir pekan untuk lomba.",
    lookingForLabel: "Mencari",
    suggestedFirstMessage: "Pesan pertama yang disarankan",
    suggestedFirstMessagePlaceholder: "Saya melihat keahlian Anda dan merasa kita bisa membuat tim yang kuat. Mau membahas peran?",
    additionalSkills: "Keahlian tambahan",
    addCustom: "Tambah khusus",
    add: "Tambah",
    addSkill: "Tambah keahlian",
    titleRole: "Judul / peran",
    projectOrganization: "Proyek / organisasi",
    period: "Periode",
    description: "Deskripsi",
    relatedSkills: "Keahlian terkait",
    labelField: "Label",
    urlField: "URL",
    urlWarning: "Gunakan URL lengkap yang diawali http atau https.",
    fullNameRequiredValidation: "Nama lengkap wajib diisi.",
    campusRequired: "Kampus wajib diisi.",
    programRequired: "Fakultas atau program studi wajib diisi.",
    mainRoleRequired: "Peran utama wajib diisi.",
    mainSkillRequired: "Keahlian utama wajib diisi.",
    collaborationTypeRequired: "Pilih minimal satu jenis kolaborasi.",
    skillRequired: "Pilih minimal 3 keahlian.",
    profileSummaryLimit: "Ringkasan profil harus di bawah 180 karakter.",
    experienceSummaryLimit: "Ringkasan pengalaman harus di bawah 240 karakter.",
    experienceTitleRequired: "Judul pengalaman wajib diisi.",
    projectRequired: "Proyek atau organisasi wajib diisi.",
    experienceDescriptionRequired: "Deskripsi pengalaman wajib diisi.",
    portfolioUrlInvalid: "URL harus diawali http atau https.",
    availabilityRequired: "Ketersediaan wajib diisi.",
    lookingForRequired: "Pilih minimal satu peran yang Anda cari.",
    matchEyebrow: "Ini kecocokan Mutualizm",
    matchTitlePrefix: "Anda dan",
    matchTitleSuffix: "sama-sama tertarik berkolaborasi.",
    suggestionMatch: "Saran kecocokan",
    suggestionTitleSuffix: "cocok dengan profil onboarding Anda.",
    whySuggested: "Kenapa disarankan",
    skillCategory: "Kategori keahlian",
    anyCategory: "Semua kategori",
    specificSkill: "Keahlian spesifik",
    anySkill: "Semua keahlian",
    role: "Peran",
    anyRole: "Semua peran",
    anyAvailability: "Semua ketersediaan",
    collaborationGoal: "Tujuan kolaborasi",
    anyGoal: "Semua tujuan",
    anyProgram: "Semua program",
    experienceLevel: "Level pengalaman",
    anyLevel: "Semua level",
    applyFilters: "Terapkan filter"
  }
};

type TranslationSet = typeof translations.en;

function useTranslations() {
  const { language } = useSymbio();
  return translations[language];
}

const SymbioContext = createContext<SymbioStore | null>(null);

function useSymbio() {
  const context = useContext(SymbioContext);
  if (!context) {
    throw new Error("Symbio context is missing.");
  }
  return context;
}

function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Browser storage is optional for the prototype; the UI still works in memory.
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSymbio();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AuthPage() {
  const { login, signup, isAuthenticated, addToast } = useSymbio();
  const t = useTranslations();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "signup">(
    location.pathname === "/signup" ? "signup" : "login"
  );
  const [fullName, setFullName] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as any)?.from?.pathname || "/discover";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    setMode(location.pathname === "/signup" ? "signup" : "login");
  }, [location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const success = login(loginEmail, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(t.invalidLogin);
      }
    } else {
      if (!fullName.trim()) {
        setError(t.fullNameRequired);
        return;
      }
      if (!emailPrefix.trim()) {
        setError(t.emailUsernameRequired);
        return;
      }
      if (password.length < 8) {
        setError(t.passwordMin);
        return;
      }
      const fullEmail = `${emailPrefix.trim()}@telkomuniversity.ac.id`;
      signup(fullName, fullEmail, password);
      navigate("/onboarding");
    }
  };

  const handleSSOLogin = (provider: string) => {
    // Quick login with mock SSO
    const mockEmail = `${provider.toLowerCase()}@telkomuniversity.ac.id`;

    const registeredUsers = JSON.parse(window.localStorage.getItem("mutualizm.users") || "[]");
    const userExists = registeredUsers.some((u: any) => u.email === mockEmail);

    if (userExists) {
      login(mockEmail, "mockpassword");
      navigate(from, { replace: true });
    } else {
      signup(`${provider} User`, mockEmail, "mockpassword");
      navigate("/onboarding");
    }
  };

  return (
    <div className="auth-shell page-transition">
      <div className="auth-bg-blob-1" />
      <div className="auth-bg-blob-2" />

      <div className="auth-layout">
        <section className="auth-brand-panel" aria-label="Mutualizm introduction">
          <Link to="/" className="auth-home-link">
            <ArrowLeft size={18} aria-hidden="true" />
            {t.home}
          </Link>
          <div>
            <span className="auth-brand-mark">Mutualizm</span>
            <h1>{t.landingHeroTitle}</h1>
            <p>{t.landingHeroBody}</p>
          </div>
          <div className="auth-value-list">
            <span>{t.landingFeatureDiscover}</span>
            <span>{t.landingFeatureSwipe}</span>
            <span>{t.aiAssistantIntro}</span>
          </div>
        </section>

      <div className="auth-container">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 600, marginBottom: 16, textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
          {t.home}
        </Link>
        <div className="auth-header">
          <div className="auth-logo-wrap">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <h1>{mode === "login" ? t.welcomeBack : t.createAccount}</h1>
          <p>
            {mode === "login"
              ? t.loginSubtitle
              : t.signupSubtitle}
          </p>
        </div>

        {error ? (
          <div className="auth-error-box" role="alert">
            <p>{error}</p>
          </div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <div className="auth-field">
              <label htmlFor="fullName">{t.fullName}</label>
              <input
                id="fullName"
                type="text"
                className="auth-input"
                placeholder="e.g. Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          ) : null}

          <div className="auth-field">
            <label htmlFor="email">{t.campusEmail}</label>
            {mode === "signup" ? (
              <div className="auth-input-wrapper">
                <input
                  id="email"
                  type="text"
                  className="auth-input auth-input-with-suffix"
                  placeholder="username"
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value)}
                  required
                />
                <div className="auth-input-suffix">
                  @telkomuniversity.ac.id
                </div>
              </div>
            ) : (
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="student@telkomuniversity.ac.id"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            )}
          </div>

          <div className="auth-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">{t.password}</label>
              {mode === "login" ? (
                <a href="#" className="auth-forgot-link" onClick={(e) => { e.preventDefault(); addToast(t.resetToastTitle, t.resetToastBody); }}>
                  {t.forgotPassword}
                </a>
              ) : null}
            </div>
            <div className="auth-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {mode === "signup" ? (
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', margin: '4px 0 0' }}>
                {t.passwordHint}
              </p>
            ) : null}
          </div>

          <button type="submit" className="auth-btn-primary">
            {mode === "login" ? t.signIn : t.createAccount}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">{t.orContinueWith}</span>
          <div className="auth-divider-line" />
        </div>

        <button type="button" className="auth-btn-social" onClick={() => handleSSOLogin("Student")}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>hub</span>
          {t.teluSso}
        </button>

        <button type="button" className="auth-btn-social" onClick={() => handleSSOLogin("Google")}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.39-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          {t.googleAccount}
        </button>

        <div className="auth-footer">
          {mode === "login" ? (
            <>
              {t.dontHaveAccount}{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode("signup"); setError(""); }}>
                {t.signUp}
              </a>
            </>
          ) : (
            <>
              {t.alreadyHaveAccount}{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); setError(""); }}>
                {t.signIn}
              </a>
            </>
          )}
        </div>

        <div className="auth-legal">
          {t.authLegalPrefix} <br />
          <Link to="/terms">{t.termsOfService}</Link> {t.and} <Link to="/privacy">{t.privacyPolicy}</Link>.
        </div>
      </div>
      </div>
    </div>
  );
}

function App() {
  const [profile, setProfile] = useLocalStorageState("mutualizm.profile", starterProfile);
  const [filters, setFilters] = useLocalStorageState("mutualizm.filters", defaultFilters);
  const [passedIds, setPassedIds] = useLocalStorageState<string[]>("mutualizm.passed", []);
  const [interestedIds, setInterestedIds] = useLocalStorageState<string[]>(
    "mutualizm.interested",
    []
  );
  const [savedIds, setSavedIds] = useLocalStorageState<string[]>("mutualizm.saved", []);
  const [matches, setMatches] = useLocalStorageState<MatchRecord[]>(
    "mutualizm.matches",
    mockMatches
  );
  const [notifications, setNotifications] = useLocalStorageState<NotificationItem[]>(
    "mutualizm.notifications",
    mockNotifications
  );
  const [chats, setChats] = useLocalStorageState<Record<string, ChatMessage[]>>(
    "mutualizm.chats",
    mockChats
  );
  const [previousActions, setPreviousActions] = useLocalStorageState<PreviousAction[]>(
    "mutualizm.previous",
    []
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [language, setLanguage] = useLocalStorageState<"en" | "id">("mutualizm.language", "en");
  const addToast = useCallback((title: string, body: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, title, body }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3800);
  }, []);

  const [user, setUser] = useLocalStorageState<{ name: string; email: string; role?: string } | null>(
    "mutualizm.user",
    null
  );
  const isAuthenticated = user !== null;

  const login = useCallback(
    (email: string, password: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const registeredUsers = JSON.parse(
        window.localStorage.getItem("mutualizm.users") || "[]"
      );
      const matchedUser = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
      );

      if (matchedUser) {
        setUser(matchedUser);
        addToast(language === "id" ? "Selamat datang kembali!" : "Welcome back!", language === "id" ? `Masuk sebagai ${matchedUser.name}` : `Logged in as ${matchedUser.name}`);
        return true;
      }
      return false;
    },
    [addToast, language, setUser]
  );

  const signup = useCallback(
    (name: string, email: string, password: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const cleanName = name.trim();

      const registeredUsers = JSON.parse(
        window.localStorage.getItem("mutualizm.users") || "[]"
      );

      if (registeredUsers.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
        addToast(language === "id" ? "Gagal" : "Error", language === "id" ? "Akun dengan email ini sudah ada." : "An account with this email already exists.");
        return;
      }

      const newUser = {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: ""
      };

      registeredUsers.push(newUser);
      window.localStorage.setItem("mutualizm.users", JSON.stringify(registeredUsers));
      setUser(newUser);

      const newProfile: CandidateProfile = {
        ...starterProfile,
        id: "me",
        name: cleanName,
        campus: "Telkom University",
        program: "",
        role: "",
        mainSkill: "",
        skills: [],
        profileSummary: "",
        experienceSummary: "",
        experiences: [],
        lookingFor: [],
        availability: "available",
        availabilityDetail: "",
        collaborationGoals: [],
        portfolioLinks: [
          { label: "GitHub", url: "" },
          { label: "Figma", url: "" },
          { label: "Portfolio", url: "" }
        ],
        preferredRole: "",
        suggestedMessage: "",
        avatarPosition: "center 42%",
        statusLabel: "",
        mutualInterest: false
      };

      setProfile(newProfile);
      addToast(language === "id" ? "Akun dibuat!" : "Account created!", language === "id" ? "Lengkapi profil onboarding Anda." : "Please complete your onboarding profile.");
    },
    [addToast, language, setProfile, setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    addToast(language === "id" ? "Keluar" : "Logged out", language === "id" ? "Anda sudah keluar dari sesi." : "You have been logged out of your session.");
  }, [addToast, language, setUser]);

  const actOnCandidate = useCallback(
    (candidate: CandidateProfile, action: SwipeAction, createdMatch = false) => {
      const addUnique = (setter: Dispatch<SetStateAction<string[]>>) => {
        setter((current) =>
          current.includes(candidate.id) ? current : [candidate.id, ...current]
        );
      };

      if (action === "pass") {
        addUnique(setPassedIds);
      }

      if (action === "save") {
        addUnique(setSavedIds);
      }

      if (action === "interest") {
        addUnique(setInterestedIds);

        if (createdMatch) {
          const newMatch = createMatchFor(candidate);
          setMatches((current) =>
            current.some((match) => match.candidateId === candidate.id)
              ? current
              : [newMatch, ...current]
          );
          setChats((current) =>
            current[newMatch.id]
              ? current
              : {
                  ...current,
                  [newMatch.id]: [
                    {
                      id: `hello-${candidate.id}`,
                      sender: "them",
                      text: candidate.suggestedMessage,
                      timestamp: "Just now"
                    }
                  ]
                }
          );
          setNotifications((current) => [
            {
              id: `notif-match-${candidate.id}`,
              type: "match",
              title: "New Mutualizm match",
              body: `${candidate.name} is also interested in collaborating.`,
              time: "Just now",
              read: false
            },
            ...current
          ]);
        }
      }

      setPreviousActions((current) => [
        { id: candidate.id, action, createdMatch },
        ...current.slice(0, 8)
      ]);
    },
    [
      addToast,
      setChats,
      setInterestedIds,
      setMatches,
      setNotifications,
      setPassedIds,
      setPreviousActions,
      setSavedIds
    ]
  );

  const rewindLast = useCallback(() => {
    const last = previousActions[0];
    if (!last) {
      addToast("Nothing to rewind", "You can rewind after taking an action on a card.");
      return;
    }

    const removeId = (setter: Dispatch<SetStateAction<string[]>>) => {
      setter((current) => current.filter((id) => id !== last.id));
    };

    if (last.action === "pass") {
      removeId(setPassedIds);
    }
    if (last.action === "interest") {
      removeId(setInterestedIds);
    }
    if (last.action === "save") {
      removeId(setSavedIds);
    }

    if (last.createdMatch) {
      setMatches((current) => current.filter((match) => match.candidateId !== last.id));
      setNotifications((current) =>
        current.filter((notification) => notification.id !== `notif-match-${last.id}`)
      );
    }

    setPreviousActions((current) => current.slice(1));
  }, [
    addToast,
    previousActions,
    setInterestedIds,
    setMatches,
    setNotifications,
    setPassedIds,
    setPreviousActions,
    setSavedIds
  ]);

  const resetDeck = useCallback(() => {
    setPassedIds([]);
    setInterestedIds([]);
    setSavedIds([]);
    setPreviousActions([]);
  }, [setInterestedIds, setPassedIds, setPreviousActions, setSavedIds]);

  const clearMatches = useCallback(() => {
    const matchIds = new Set(matches.map((match) => match.id));
    setMatches([]);
    setChats((current) =>
      Object.fromEntries(Object.entries(current).filter(([matchId]) => !matchIds.has(matchId)))
    );
    setNotifications((current) =>
      current.filter((notification) => !notification.id.startsWith("notif-match-"))
    );
  }, [matches, setChats, setMatches, setNotifications]);

  const removeMatch = useCallback(
    (matchId: string) => {
      const removedMatch = matches.find((match) => match.id === matchId);
      setMatches((current) => current.filter((match) => match.id !== matchId));
      setChats((current) =>
        Object.fromEntries(Object.entries(current).filter(([currentMatchId]) => currentMatchId !== matchId))
      );
      if (removedMatch) {
        setNotifications((current) =>
          current.filter((notification) => notification.id !== `notif-match-${removedMatch.candidateId}`)
        );
      }
      addToast(
        language === "id" ? translations.id.matchRemovedTitle : translations.en.matchRemovedTitle,
        language === "id" ? translations.id.matchRemovedBody : translations.en.matchRemovedBody
      );
    },
    [addToast, language, matches, setChats, setMatches, setNotifications]
  );

  const removeSaved = useCallback(
    (candidateId: string) => {
      setSavedIds((current) => current.filter((id) => id !== candidateId));
    },
    [setSavedIds]
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);

  const markNotificationRead = useCallback(
    (notificationId: string) => {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    },
    [setNotifications]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true }))
    );
  }, [setNotifications]);

  const sendMessage = useCallback(
    (matchId: string, text: string) => {
      const cleanText = text.trim();
      if (!cleanText) {
        return;
      }

      const now = new Date();
      const timestamp = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      setChats((current) => ({
        ...current,
        [matchId]: [
          ...(current[matchId] ?? []),
          {
            id: `msg-${Date.now()}`,
            sender: "me",
            text: cleanText,
            timestamp
          }
        ]
      }));
      setMatches((current) =>
        current.map((match) =>
          match.id === matchId ? { ...match, latestMessage: cleanText, unread: 0 } : match
        )
      );
    },
    [setChats, setMatches]
  );

  const value = useMemo<SymbioStore>(
    () => ({
      profile,
      setProfile,
      filters,
      setFilters,
      passedIds,
      interestedIds,
      savedIds,
      matches,
      setMatches,
      notifications,
      chats,
      setChats,
      toasts,
      actOnCandidate,
      rewindLast,
      resetDeck,
      clearMatches,
      removeMatch,
      removeSaved,
      clearFilters,
      markNotificationRead,
      markAllNotificationsRead,
      sendMessage,
      addToast,
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      language,
      setLanguage
    }),
    [
      actOnCandidate,
      addToast,
      chats,
      setChats,
      clearMatches,
      removeMatch,
      clearFilters,
      filters,
      interestedIds,
      markAllNotificationsRead,
      markNotificationRead,
      matches,
      setMatches,
      notifications,
      passedIds,
      profile,
      removeSaved,
      resetDeck,
      rewindLast,
      savedIds,
      sendMessage,
      setFilters,
      setProfile,
      toasts,
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      language,
      setLanguage
    ]
  );

  return (
    <SymbioContext.Provider value={value}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/chat/:matchId" element={<ChatPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/discover" replace />} />
      </Routes>
      <ToastStack />
    </SymbioContext.Provider>
  );
}

function LandingPage() {
  const { isAuthenticated } = useSymbio();
  const t = useTranslations();
  const [landingMenuOpen, setLandingMenuOpen] = useState(false);
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setLandingMenuOpen(false);
  };

  return (
    <div className="landing-shell page-transition">
      <div className="auth-bg-blob-1" />
      <div className="auth-bg-blob-2" />

      <header className="landing-nav">
        <Link to="/" className="brand-mark" aria-label="Mutualizm home" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "1.25rem", color: "var(--primary)" }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "28px" }}>hub</span>
          <span>Mutualizm</span>
        </Link>
        <nav className="landing-links" aria-label="Landing navigation" style={{ fontWeight: "600" }}>
          <a href="#how" onClick={(e) => { e.preventDefault(); scrollToSection("how"); }}>{t.landingHow}</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>{t.landingFeatures}</a>
          {isAuthenticated ? (
            <Link to="/discover" className="button button-primary" style={{ minHeight: "38px", padding: "0 16px", borderRadius: "20px", fontSize: "0.85rem" }}>{t.landingOpenApp}</Link>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/login" className="button button-ghost" style={{ minHeight: "38px", padding: "0 12px", fontSize: "0.85rem" }}>{t.signIn}</Link>
              <Link to="/signup" className="button button-primary" style={{ minHeight: "38px", padding: "0 16px", borderRadius: "20px", fontSize: "0.85rem" }}>{t.signUp}</Link>
            </div>
          )}
        </nav>
        <button
          type="button"
          className="landing-menu-button"
          aria-label="Open landing menu"
          onClick={() => setLandingMenuOpen((current) => !current)}
        >
          {landingMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </header>
      {landingMenuOpen ? (
        <div className="landing-mobile-menu">
          <a href="#how" onClick={(e) => { e.preventDefault(); scrollToSection("how"); }}>{t.landingHow}</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>{t.landingFeatures}</a>
          {isAuthenticated ? (
            <Link to="/discover">{t.landingOpenApp}</Link>
          ) : (
            <>
              <Link to="/login">{t.signIn}</Link>
              <Link to="/signup">{t.signUp}</Link>
            </>
          )}
        </div>
      ) : null}

      <main style={{ position: "relative", zIndex: 10 }}>
        <section className="landing-hero">
          <div className="hero-copy">
            <p className="eyebrow" style={{ color: "var(--primary)", fontWeight: "700", letterSpacing: "0.05em" }}>{t.landingHeroEyebrow}</p>
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "700", lineHeight: "1.1", color: "var(--ink)", margin: 0 }}>
              {t.landingHeroTitle}
            </h1>
            <p className="hero-lede" style={{ color: "var(--on-surface-variant)", lineHeight: "1.6" }}>
              {t.landingHeroBody}
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" to={isAuthenticated ? "/discover" : "/signup"} style={{ padding: "0 32px", borderRadius: "30px", height: "48px", fontSize: "0.95rem" }}>
                {t.landingStartMatching}
              </Link>
              <Link className="button button-secondary" to="/discover" style={{ padding: "0 32px", borderRadius: "30px", height: "48px", fontSize: "0.95rem" }}>
                {t.landingTryDemo}
              </Link>
            </div>
            <div className="hero-metrics">
              <span>{t.landingMetricsRoles}</span>
              <span>{t.landingMetricsSwipe}</span>
              <span>{t.landingMetricsChats}</span>
            </div>
          </div>

          <HeroCardCarousel />
        </section>

        <section className="section-band" id="how" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="section-heading" style={{ textAlign: "center", margin: "0 auto 48px" }}>
            <p className="eyebrow" style={{ color: "var(--primary)", fontWeight: "700", letterSpacing: "0.05em" }}>{t.landingHow}</p>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "700", fontSize: "2.2rem", color: "var(--ink)" }}>{t.landingHowTitle}</h2>
          </div>
          <div className="steps-grid">
            <StepCard
              number="01"
              title={t.landingStepProfileTitle}
              body={t.landingStepProfileBody}
            />
            <StepCard
              number="02"
              title={t.landingStepSwipeTitle}
              body={t.landingStepSwipeBody}
            />
            <StepCard
              number="03"
              title={t.landingStepBuildTitle}
              body={t.landingStepBuildBody}
            />
          </div>
        </section>

        <section className="section-band feature-strip-section" id="features">
          <div className="section-heading">
            <p className="eyebrow">{t.landingFeatures}</p>
            <h2>{t.landingFeaturesTitle}</h2>
          </div>
          <div className="feature-grid">
            <FeatureItem icon={<Search size={20} aria-hidden="true" />} text={t.landingFeatureDiscover} />
            <FeatureItem icon={<Heart size={20} aria-hidden="true" />} text={t.landingFeatureSwipe} />
            <FeatureItem icon={<MessageCircle size={20} aria-hidden="true" />} text={t.landingFeatureChat} />
            <FeatureItem icon={<Settings size={20} aria-hidden="true" />} text={t.landingFeatureSettings} />
          </div>
        </section>

        <section className="cta-band">
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "700", fontSize: "2.2rem", color: "var(--ink)", margin: 0 }}>{t.landingCtaTitle}</h2>
          <p style={{ color: "var(--on-surface-variant)", fontSize: "1.1rem", margin: "14px 0 32px" }}>{t.landingCtaBody}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to={isAuthenticated ? "/discover" : "/signup"} style={{ padding: "0 32px", borderRadius: "30px", height: "48px", fontSize: "0.95rem" }}>
              {t.landingStartMatching}
            </Link>
            <Link className="button button-secondary" to="/discover" style={{ padding: "0 32px", borderRadius: "30px", height: "48px", fontSize: "0.95rem" }}>
              {t.landingOpenDiscover}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function StepCard({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <article className="step-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function FeatureItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <article className="feature-item">
      {icon}
      <span>{text}</span>
    </article>
  );
}

const heroCarouselCards = [
  {
    name: "Ahmad Rizky Ivanzya",
    role: "Publikasi Assistant",
    summary: "Database System Practicum Assistant yang cocok untuk tim publikasi, UI, dan dokumentasi produk.",
    skills: ["Publikasi", "UI/UX", "Documentation"],
    avatarUrl: "/profile-cover-rizky.jpg"
  },
  {
    name: "Sarah Chen",
    role: "Full-Stack Developer",
    summary: "Building scalable web applications with React and Laravel. Seeking a designer co-founder for an EdTech startup.",
    skills: ["React", "Laravel", "TypeScript"],
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbuH2czzOu3XpPXAgDIG9uZp9JwHSVP5HOJeoUdFxXZ7TAGd7GkRsON_8T5J3AgGiJK7ohhXr0be8IcHYnmeRnfTdS1GB8fUSrqDYgU8LLIY0iMx6UDdC8-u43fVQ4jqTFz-NE6ONoMDrkd0maVzDgIlWhnfUn4fGBPkdsIOWthrzx2zd6cCu7a4cB2MM4_ra5Sv91UXx0qPL6QYYcqZbW6b4uMdpHW4KHgkRkS0LrUdaEdMKJ8jwGgaGUuK8ZBXEoyKpHMHfvDoM"
  },
  {
    name: "Marcus Rivera",
    role: "Business Strategist",
    summary: "Experienced in go-to-market strategies and pitch deck design. Looking for technical co-founders for a campus marketplace.",
    skills: ["Strategy", "Pitching", "Market Research"],
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPDk4pHub8NGPABmj2-xqKPQvhCXXp9oL3wtVphFeA4h-G6751JbmjVdA2LusfwXMQLJEioYWLASijLvIrFgzy-K4b2y5UjlI56N6Pz0kCmDehf9y5j6Oz1hYSaMPJ47h2XWUeTklPEMoz-CBvEMAZtJ0DyeDYmBiTkV4NfBcdVN6rrBXaKSISC9TDP91IUrXZGXcfD__GsRCLQj3oDhiUK_Y30YENnJBlsCJ2sV7Cny_BMz7uTdmO7sPhbpfidcF6NG6274UCaWw"
  }
];

function HeroCardCarousel() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [motion, setMotion] = useState<"next" | "prev" | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const wheelLocked = useRef(false);
  const total = heroCarouselCards.length;
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  const moveCard = useCallback(
    (direction: "next" | "prev") => {
      if (motion) {
        return;
      }

      if (reducedMotion) {
        setHeroIndex((prev) =>
          direction === "next" ? (prev + 1) % total : (prev - 1 + total) % total
        );
        setDragX(0);
        return;
      }

      setMotion(direction);
      window.setTimeout(() => {
        setHeroIndex((prev) =>
          direction === "next" ? (prev + 1) % total : (prev - 1 + total) % total
        );
        setDragX(0);
        setMotion(null);
      }, 260);
    },
    [motion, reducedMotion, total]
  );

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (motion) {
      return;
    }
    pointerStart.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!pointerStart.current || motion) {
      return;
    }

    setDragX(e.clientX - pointerStart.current.x);
  };

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = () => {
    if (!pointerStart.current) return;
    const deltaX = dragX;
    if (Math.abs(deltaX) > 50) {
      moveCard(deltaX < 0 ? "next" : "prev");
    } else {
      setDragX(0);
    }
    pointerStart.current = null;
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const horizontalSwipe = Math.abs(event.deltaX) > 32;
    const verticalSwipe = Math.abs(event.deltaY) > 54;
    if ((!horizontalSwipe && !verticalSwipe) || wheelLocked.current) {
      return;
    }

    wheelLocked.current = true;
    moveCard(event.deltaX > 0 || event.deltaY > 0 ? "next" : "prev");
    window.setTimeout(() => {
      wheelLocked.current = false;
    }, 520);
  };

  const card = heroCarouselCards[heroIndex];
  const cardStyle = {
    transform: `translateX(${dragX}px) rotate(${Math.max(-8, Math.min(8, dragX / 24))}deg)`
  } as CSSProperties;

  return (
    <div className="hero-preview" aria-label="Mutualizm card preview">
      <div className="preview-card-back preview-card-back-one" />
      <div className="preview-card-back preview-card-back-two" />

      <div
        className={`hero-carousel ${motion ? `hero-motion-${motion}` : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <div
          className={`hero-carousel-card ${motion === 'next' ? 'carousel-slide-left' : ''} ${motion === 'prev' ? 'carousel-slide-right' : ''}`}
          style={cardStyle}
        >
          <img src={card.avatarUrl} alt={card.name} draggable={false} />
          <div className="hero-card-overlay">
            <div className="hero-card-topline">
              <div>
                <h3>{card.name}</h3>
                <p>{card.role}</p>
              </div>
              <div className="hero-status-pill">
                <span />
                Available
              </div>
            </div>
            <small>{card.summary}</small>
            <div className="hero-card-chips">
              {card.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="carousel-dots" aria-label="Hero card controls">
          {heroCarouselCards.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to card ${i + 1}`}
              onClick={() => setHeroIndex(i)}
              className={i === heroIndex ? "active" : ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const { profile, notifications } = useSymbio();
  const location = useLocation();
  const showFilters = location.pathname === "/discover";
  const isChatRoute = location.pathname.startsWith("/chat/");
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleMenuClick = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setSidebarCollapsed((prev) => !prev);
      setMobileDrawerOpen(false);
      return;
    }

    setMobileDrawerOpen((prev) => !prev);
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <TopBar unreadCount={unreadCount} onMenuClick={handleMenuClick} />

      {mobileDrawerOpen ? (
        <div className="mobile-drawer-overlay" onClick={() => setMobileDrawerOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="brand-mark">
                <span className="brand-icon">S</span>
                <span>Mutualizm</span>
              </span>
              <button className="close-btn" aria-label="Close menu" onClick={() => setMobileDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <MiniProfile profile={profile} />
            <SidebarNav
              onLinkClick={() => setMobileDrawerOpen(false)}
              onSettingsClick={() => {
                setMobileDrawerOpen(false);
                setSettingsOpen(true);
              }}
              onLogoutClick={() => {
                setMobileDrawerOpen(false);
                setLogoutOpen(true);
              }}
            />
            {showFilters ? (
              <div className="drawer-filter">
                <FilterPanel variant="mobile" onApplied={() => setMobileDrawerOpen(false)} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <main className={`app-grid ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <aside className="left-panel" aria-label="Navigation and filters">
          <MiniProfile profile={profile} isCollapsed={sidebarCollapsed} />
          <SidebarNav
            isCollapsed={sidebarCollapsed}
            onSettingsClick={() => setSettingsOpen(true)}
            onLogoutClick={() => setLogoutOpen(true)}
          />
          {showFilters && !sidebarCollapsed ? <FilterPanel variant="desktop" /> : null}
        </aside>

        <section className="center-stage">
          <Outlet />
        </section>

        <aside className="right-panel" aria-label="Activity panel">
          <RightRail />
        </aside>
        {!isChatRoute ? <BottomNav unreadCount={unreadCount} /> : null}
      </main>

      <AiAssistantBubble />
      {!isChatRoute ? <FollowChatBubble /> : null}

      {settingsOpen ? <SettingsDrawer onClose={() => setSettingsOpen(false)} onLogoutRequest={() => setLogoutOpen(true)} /> : null}
      {logoutOpen ? <LogoutConfirmModal onClose={() => setLogoutOpen(false)} /> : null}
    </div>
  );
}

function TopBar({ unreadCount, onMenuClick }: { unreadCount: number; onMenuClick?: () => void }) {
  return (
    <header className="top-bar">
      <button className="top-icon-button" aria-label="Open menu" onClick={onMenuClick}>
        <Menu size={22} aria-hidden="true" />
      </button>
      <Link to="/discover" className="top-logo" aria-label="Mutualizm discover">
        Mutualizm <span>✦</span>
      </Link>
      <div className="top-actions">
        <Link to="/notifications" className="icon-link" aria-label="Open notifications">
          <Bell size={20} aria-hidden="true" />
          {unreadCount > 0 ? <span className="count-badge">{unreadCount}</span> : null}
        </Link>
      </div>
    </header>
  );
}

function SidebarNav({
  isCollapsed = false,
  onLinkClick,
  onSettingsClick,
  onLogoutClick
}: {
  isCollapsed?: boolean;
  onLinkClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}) {
  const t = useTranslations();

  const handleLogout = () => {
    onLinkClick?.();
    onLogoutClick?.();
  };

  const handleSettings = () => {
    onLinkClick?.();
    onSettingsClick?.();
  };

  const getNavLabel = (to: string) => {
    switch (to) {
      case "/discover": return t.discover;
      case "/matches": return t.matches;
      case "/saved": return t.saved;
      case "/projects": return t.projects;
      case "/notifications": return t.alerts;
      case "/profile": return t.profile;
      default: return "";
    }
  };

  return (
    <nav className={`side-nav ${isCollapsed ? "collapsed" : ""}`} aria-label="Primary navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const label = getNavLabel(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            title={isCollapsed ? label : undefined}
            onClick={onLinkClick}
          >
            <Icon size={18} aria-hidden="true" />
            {!isCollapsed && <span>{label}</span>}
          </NavLink>
        );
      })}
      <button
        onClick={handleSettings}
        className="button-logout side-menu-button"
        title={isCollapsed ? t.settings : undefined}
      >
        <Settings size={18} aria-hidden="true" />
        {!isCollapsed && <span>{t.settings}</span>}
      </button>
      <button
        onClick={handleLogout}
        className="button-logout side-menu-button danger"
        title={isCollapsed ? t.logout : undefined}
      >
        <LogOut size={18} aria-hidden="true" />
        {!isCollapsed && <span>{t.logout}</span>}
      </button>
    </nav>
  );
}

function SettingsDrawer({
  onClose,
  onLogoutRequest
}: {
  onClose: () => void;
  onLogoutRequest: () => void;
}) {
  const { profile, setProfile, language, setLanguage, addToast, user, logout } = useSymbio();
  const t = useTranslations();
  const navigate = useNavigate();
  const [draft, setDraft] = useState({
    name: profile.name,
    avatarUrl: profile.avatarUrl ?? "",
    avatarPosition: profile.avatarPosition ?? "center 42%",
    campus: profile.campus,
    program: profile.program,
    role: profile.role,
    mainSkill: profile.mainSkill,
    bio: profile.profileSummary,
    statusLabel: profile.statusLabel ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    language
  });
  const [settingsError, setSettingsError] = useState("");

  const saveSettings = () => {
    setSettingsError("");
    if (draft.newPassword || draft.confirmPassword) {
      if (draft.newPassword.length < 8) {
        setSettingsError(t.passwordNewMinError);
        return;
      }
      if (draft.newPassword !== draft.confirmPassword) {
        setSettingsError(t.passwordConfirmError);
        return;
      }

      const registeredUsers = JSON.parse(window.localStorage.getItem("mutualizm.users") || "[]") as Array<{
        email: string;
        password?: string;
      }>;
      window.localStorage.setItem(
        "mutualizm.users",
        JSON.stringify(
          registeredUsers.map((account) =>
            account.email === user?.email ? { ...account, password: draft.newPassword } : account
          )
        )
      );
    }

    setProfile((current) => ({
      ...current,
      name: draft.name.trim() || current.name,
      avatarUrl: draft.avatarUrl.trim() || current.avatarUrl,
      avatarPosition: draft.avatarPosition,
      campus: draft.campus.trim(),
      program: draft.program.trim(),
      role: draft.role.trim(),
      mainSkill: draft.mainSkill.trim(),
      profileSummary: draft.bio.trim(),
      statusLabel: draft.statusLabel.trim()
    }));
    setLanguage(draft.language);
    addToast(t.settingsSavedTitle, t.settingsSavedBody);
    onClose();
  };

  const updateDraft = (key: keyof typeof draft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const deleteAccount = () => {
    const confirmed = window.confirm(t.deleteAccountConfirm);
    if (!confirmed) {
      return;
    }

    const registeredUsers = JSON.parse(window.localStorage.getItem("mutualizm.users") || "[]") as Array<{ email: string }>;
    window.localStorage.setItem(
      "mutualizm.users",
      JSON.stringify(registeredUsers.filter((account) => account.email !== user?.email))
    );
    ["mutualizm.profile", "mutualizm.filters", "mutualizm.passed", "mutualizm.interested", "mutualizm.saved", "mutualizm.previous"].forEach((key) =>
      window.localStorage.removeItem(key)
    );
    logout();
    onClose();
    navigate("/login");
  };

  return createPortal(
    <div className="overlay settings-overlay" role="presentation" onClick={onClose}>
      <aside
        className="settings-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Profile and website settings"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-drawer-header">
          <div>
            <p className="eyebrow">{t.settings}</p>
            <h2>{t.settingsDrawerTitle}</h2>
          </div>
          <Button variant="circle" aria-label="Close settings" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </Button>
        </header>

        <div className="settings-note">
          <strong>{t.settingsRulesTitle}</strong>
          <p>{t.settingsRulesBody}</p>
        </div>

        <div className="settings-form-grid">
          <TextField label={t.name} value={draft.name} onChange={(value) => updateDraft("name", value)} />
          <PhotoUploadField
            label={t.profilePhoto}
            value={draft.avatarUrl}
            position={draft.avatarPosition}
            onChange={(value) => updateDraft("avatarUrl", value)}
            onPositionChange={(value) => updateDraft("avatarPosition", value)}
          />
          <TextField label={t.campus} value={draft.campus} onChange={(value) => updateDraft("campus", value)} />
          <TextField label={t.program} value={draft.program} onChange={(value) => updateDraft("program", value)} />
          <TextField label={t.roleMain} value={draft.role} onChange={(value) => updateDraft("role", value)} />
          <TextField label={t.mainSkill} value={draft.mainSkill} onChange={(value) => updateDraft("mainSkill", value)} />
          <label className="field settings-select-field">
            <span>{t.statusBadge}</span>
            <select
              value={draft.statusLabel}
              onChange={(event) => updateDraft("statusLabel", event.target.value)}
            >
              <option value="">{t.defaultStatus}</option>
              <option value="Looking for project">{t.lookingForProject}</option>
              <option value="Available this week">{t.availableThisWeek}</option>
              <option value="Busy, message first">{t.busyMessageFirst}</option>
            </select>
          </label>
          <label className="field settings-select-field">
            <span>{t.websiteLanguage}</span>
            <select
              value={draft.language}
              onChange={(event) => updateDraft("language", event.target.value)}
            >
              <option value="id">{t.indonesian}</option>
              <option value="en">{t.english}</option>
            </select>
          </label>
          <TextAreaField
            label={t.aboutProfile}
            value={draft.bio}
            onChange={(value) => updateDraft("bio", value)}
            minRows={4}
          />
        </div>

        <div className="settings-security-grid">
          <TextField
            label={t.currentPassword}
            value={draft.currentPassword}
            onChange={(value) => updateDraft("currentPassword", value)}
            placeholder={t.optionalDemo}
            type="password"
          />
          <TextField
            label={t.newPassword}
            value={draft.newPassword}
            onChange={(value) => updateDraft("newPassword", value)}
            placeholder={t.passwordHint}
            type="password"
          />
          <TextField
            label={t.confirmNewPassword}
            value={draft.confirmPassword}
            onChange={(value) => updateDraft("confirmPassword", value)}
            type="password"
          />
        </div>
        {settingsError ? <div className="error-box"><p>{settingsError}</p></div> : null}

        <div className="settings-preference-list">
          <label>
            <input type="checkbox" defaultChecked />
            {t.notifyPreference}
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            {t.chatPreference}
          </label>
          <label>
            <input type="checkbox" />
            {t.emailPreference}
          </label>
        </div>

        <div className="settings-actions">
          <Button variant="ghostDanger" onClick={() => { onClose(); onLogoutRequest(); }}>
            <LogOut size={18} aria-hidden="true" />
            {t.logoutAccount}
          </Button>
          <Button variant="ghostDanger" onClick={deleteAccount}>
            <Trash2 size={18} aria-hidden="true" />
            {t.deleteAccount}
          </Button>
          <div>
            <Button variant="secondary" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button variant="primary" onClick={saveSettings}>
              {t.save}
            </Button>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
}

function LogoutConfirmModal({ onClose }: { onClose: () => void }) {
  const { user, logout } = useSymbio();
  const t = useTranslations();
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState(user?.email ?? "");
  const accounts = useMemo(() => {
    const registered = JSON.parse(window.localStorage.getItem("mutualizm.users") || "[]") as Array<{
      name: string;
      email: string;
      role?: string;
    }>;
    const allAccounts = user ? [{ name: user.name, email: user.email, role: user.role }, ...registered] : registered;
    return allAccounts.filter(
      (account, index, list) =>
        account.email && list.findIndex((item) => item.email === account.email) === index
    );
  }, [user]);

  const confirmLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  return createPortal(
    <div className="overlay confirm-overlay" role="presentation" onClick={onClose}>
      <section className="confirm-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h2>{t.logoutTitle}</h2>
        <p>{t.logoutBody}</p>
        <div className="account-choice-list">
          {accounts.length ? accounts.map((account) => (
            <label key={account.email} className={selectedEmail === account.email ? "selected" : ""}>
              <input
                type="radio"
                name="logout-account"
                value={account.email}
                checked={selectedEmail === account.email}
                onChange={() => setSelectedEmail(account.email)}
              />
              <span>
                <strong>{account.name || t.mutualizmUser}</strong>
                <small>{account.email}</small>
              </span>
            </label>
          )) : (
            <p className="muted-text">{t.noActiveSession}</p>
          )}
        </div>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button variant="danger" onClick={confirmLogout} disabled={!user}>
            {t.logout}
          </Button>
        </div>
      </section>
    </div>,
    document.body
  );
}

function ProfileQrModal({ profile, onClose }: { profile: CandidateProfile; onClose: () => void }) {
  const { addToast } = useSymbio();
  const t = useTranslations();
  const profileUrl =
    typeof window === "undefined"
      ? "/profile"
      : `${window.location.origin}/profile?user=${encodeURIComponent(profile.id)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(profileUrl)}`;

  const copyLink = async () => {
    await navigator.clipboard?.writeText(profileUrl);
    addToast(t.linkCopiedTitle, t.linkCopiedBody);
  };

  return createPortal(
    <div className="overlay confirm-overlay" role="presentation" onClick={onClose}>
      <section className="qr-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <Button variant="circle" className="modal-close" aria-label="Close QR modal" onClick={onClose}>
          <X size={18} aria-hidden="true" />
        </Button>
        <h2>{t.qrTitle}</h2>
        <p>{t.qrBody} {profile.name}.</p>
        <img src={qrUrl} alt={`QR code for ${profile.name} profile`} />
        <a href={profileUrl} className="profile-url" target="_blank" rel="noreferrer">
          {profileUrl}
        </a>
        <div className="modal-actions">
          <Button variant="secondary" onClick={copyLink}>
            {t.copyLink}
          </Button>
          <Link className="button button-primary" to="/profile" onClick={onClose}>
            {t.openProfile}
          </Link>
        </div>
      </section>
    </div>,
    document.body
  );
}

function FollowChatBubble() {
  const { matches } = useSymbio();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const chatItems = matches
    .map((match) => ({ match, candidate: getCandidate(match.candidateId) }))
    .filter((item): item is { match: MatchRecord; candidate: CandidateProfile } => Boolean(item.candidate))
    .slice(0, 4);

  const totalUnread = matches.reduce((sum, m) => sum + m.unread, 0);

  return (
    <div className={`chat-bubble ${open ? "open" : ""}`}>
      {open ? (
        <section className="chat-bubble-panel" aria-label="Followed user chat list">
          <div className="rail-heading">
            <h2>{t.chatFollowed}</h2>
            <button className="text-link" onClick={() => setOpen(false)}>{t.closePanel}</button>
          </div>
          <div className="compact-list">
            {chatItems.length ? chatItems.map(({ match, candidate }) => (
              <Link className="compact-row" to={`/chat/${match.id}`} key={match.id} onClick={() => setOpen(false)}>
                <Avatar profile={candidate} size="xs" />
                <span>
                  <strong>{candidate.name}</strong>
                  <small>{localizeMatchMessage(match.latestMessage, t)}</small>
                </span>
                {match.unread > 0 ? <em>{match.unread}</em> : null}
              </Link>
            )) : (
              <p className="muted-text">{t.noChatUsers}</p>
            )}
          </div>
        </section>
      ) : null}
      <button className="chat-bubble-button" type="button" aria-label="Open followed user chat" onClick={() => setOpen((current) => !current)}>
        <MessageCircle size={24} aria-hidden="true" />
        {totalUnread > 0 ? <span className="chat-bubble-badge">{totalUnread}</span> : null}
      </button>
    </div>
  );
}

function AiAssistantBubble() {
  const { language } = useSymbio();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [results, setResults] = useState<CandidateProfile[]>([]);

  const presets = [
    { label: t.aiFindDesign, prompt: "I need a UI/UX designer who can help with Figma, wireframes, and user testing." },
    { label: t.aiFindBackend, prompt: "I need a backend developer who can help with Laravel, REST API, and database integration." },
    { label: t.aiFindPitch, prompt: "I need a business strategist who can help with pitch deck, market research, and validation." }
  ];

  const askAssistant = async (promptOverride?: string) => {
    const prompt = (promptOverride ?? query).trim();
    if (!prompt) {
      return;
    }

    setOpen(true);
    setQuery(prompt);
    setLoading(true);
    setResponse("");
    setResults(findCandidatesForQuery(prompt).slice(0, 3));

    const siteContext = `
You are Mutualizm AI, a website assistant for Mutualizm.
Your job is not to interrupt chats. Help the user search for collaborators by skill, role, program, availability, and project goal.
Reply in ${language === "id" ? "Indonesian" : "English"}.
Available demo candidates:
${candidates.map((candidate) => `- ${candidate.name}: ${candidate.role}, main skill ${candidate.mainSkill}, skills ${candidate.skills.map((skillItem) => skillItem.name).join(", ")}, goals ${candidate.collaborationGoals.join(", ")}, availability ${candidate.availabilityDetail}`).join("\n")}
`;

    try {
      const request = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          context: siteContext
        })
      });
      const data = await request.json();
      if (!request.ok) {
        throw new Error(data.message || "AI request failed.");
      }
      setResponse(data.message || "");
    } catch {
      setResponse(t.aiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`ai-assistant-bubble ${open ? "open" : ""}`}>
      {open ? (
        <section className="ai-assistant-panel" aria-label={t.aiAssistantTitle}>
          <header>
            <div>
              <h2>
                <Sparkles size={17} aria-hidden="true" />
                {t.aiAssistantTitle}
              </h2>
              <p>{t.aiAssistantIntro}</p>
            </div>
            <button type="button" aria-label={t.close} onClick={() => setOpen(false)}>
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="ai-assistant-presets">
            {presets.map((preset) => (
              <button type="button" key={preset.label} onClick={() => askAssistant(preset.prompt)}>
                {preset.label}
              </button>
            ))}
          </div>

          <div className="ai-assistant-response">
            {loading ? (
              <div className="ai-loading-state">
                <span className="spinner" />
                <p>{t.aiThinking}</p>
              </div>
            ) : response ? (
              <p>{response}</p>
            ) : null}

            <div className="ai-result-list">
              <strong>{t.aiMatches}</strong>
              {results.length ? (
                results.map((candidate) => (
                  <article className="ai-result-card" key={candidate.id}>
                    <Avatar profile={candidate} size="xs" />
                    <span>
                      <b>{candidate.name}</b>
                      <small>{localizeRoleLabel(candidate.role, t)} · {candidate.mainSkill}</small>
                    </span>
                  </article>
                ))
              ) : (
                <small className="muted-text">{t.aiNoMatches}</small>
              )}
            </div>
          </div>

          <form
            className="ai-assistant-form"
            onSubmit={(event) => {
              event.preventDefault();
              askAssistant();
            }}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.aiPlaceholder}
            />
            <button type="submit" disabled={!query.trim() || loading}>
              <Send size={16} aria-hidden="true" />
              <span>{t.aiAsk}</span>
            </button>
          </form>
        </section>
      ) : null}
      <button
        className="ai-assistant-button"
        type="button"
        aria-label={t.aiAssistantTitle}
        onClick={() => setOpen((current) => !current)}
      >
        <Sparkles size={23} aria-hidden="true" />
      </button>
    </div>
  );
}

function BottomNav({ unreadCount }: { unreadCount: number }) {
  const t = useTranslations();
  const mobileItems = navItems.filter((item) =>
    ["/discover", "/matches", "/saved", "/profile"].includes(item.to)
  );

  const getNavLabel = (to: string) => {
    switch (to) {
      case "/discover": return t.discover;
      case "/matches": return t.matches;
      case "/saved": return t.saved;
      case "/profile": return t.profile;
      default: return "";
    }
  };

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const label = getNavLabel(item.to);
        return (
          <NavLink key={item.to} to={item.to}>
            <span className="bottom-icon-wrap">
              <Icon size={20} aria-hidden="true" />
              {item.to === "/matches" && unreadCount > 0 ? (
                <span className="mini-dot" aria-label={`${unreadCount} ${t.unreadBadge}`} />
              ) : null}
            </span>
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function MiniProfile({ profile, isCollapsed = false }: { profile: CandidateProfile; isCollapsed?: boolean }) {
  const t = useTranslations();

  if (isCollapsed) {
    return (
      <section
        className="mini-profile collapsed"
        aria-label="Current profile"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "12px 0",
          background: "transparent",
          border: "none",
          boxShadow: "none"
        }}
      >
        <Avatar profile={profile} size="sm" />
      </section>
    );
  }

  return (
    <section className="mini-profile" aria-label="Current profile">
      <Avatar profile={profile} size="sm" />
      <div>
        <strong>{profile.name}</strong>
        <span>{localizeRoleLabel(profile.role, t)}</span>
      </div>
      <AvailabilityBadge availability={profile.availability} label={profile.statusLabel} />
    </section>
  );
}

function RightRail() {
  const { matches, notifications } = useSymbio();
  const t = useTranslations();
  const unread = notifications.filter((notification) => !notification.read);

  return (
    <div className="rail-stack">
      <section className="rail-section">
        <div className="rail-heading">
          <h2>{t.realTimeUi}</h2>
          <span className="status-dot">{t.ready}</span>
        </div>
        <p>{t.rightRailBody}</p>
      </section>

      <section className="rail-section">
        <div className="rail-heading">
          <h2>{t.recentMatches}</h2>
          <Link to="/matches">{t.view}</Link>
        </div>
        <div className="compact-list">
          {matches.slice(0, 3).map((match) => {
            const candidate = getCandidate(match.candidateId);
            return candidate ? (
              <Link className="compact-row" to={`/chat/${match.id}`} key={match.id}>
                <Avatar profile={candidate} size="xs" />
                <span>
                  <strong>{candidate.name}</strong>
                  <small>{candidate.mainSkill}</small>
                </span>
                {match.unread > 0 ? <em>{match.unread}</em> : null}
              </Link>
            ) : null;
          })}
        </div>
      </section>

      <section className="rail-section">
        <div className="rail-heading">
          <h2>{t.alertsTitle}</h2>
          <Link to="/notifications">{unread.length} {t.unreadCount}</Link>
        </div>
        <div className="compact-list">
          {notifications.slice(0, 3).map((notification) => (
            <Link className="compact-row text-row" to="/notifications" key={notification.id}>
              <span className={notification.read ? "read-dot" : "unread-dot"} />
              <span>
                <strong>{localizeNotification(notification, t).title}</strong>
                <small>{localizeNotification(notification, t).body}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {mockProjects.length > 0 && (
        <section className="rail-section">
          <div className="rail-heading">
            <h2>{t.suggestedProject}</h2>
            <Link to="/projects">{t.explore}</Link>
          </div>
          <p>
            <strong>{localizeProject(mockProjects[0], t).title}</strong>
          </p>
          <div className="chip-row">
            {mockProjects[0].neededRoles.slice(0, 2).map((role) => (
              <Chip key={role}>{localizeRoleLabel(role, t)}</Chip>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DiscoverPage() {
  const {
    filters,
    passedIds,
    interestedIds,
    savedIds,
    matches,
    actOnCandidate,
    rewindLast,
    resetDeck
  } = useSymbio();
  const t = useTranslations();
  const [detailProfile, setDetailProfile] = useState<CandidateProfile | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<CandidateProfile | null>(null);
  const [suggestedProfile, setSuggestedProfile] = useState<CandidateProfile | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [swipeMotion, setSwipeMotion] = useState<SwipeAction | null>(null);
  const [rewindAnim, setRewindAnim] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const filteredProfiles = useMemo(() => applyFilters(candidates, filters), [filters]);
  const deck = useMemo(
    () =>
      filteredProfiles.filter(
        (candidate) =>
          !passedIds.includes(candidate.id) &&
          !interestedIds.includes(candidate.id) &&
          !savedIds.includes(candidate.id)
      ),
    [filteredProfiles, interestedIds, passedIds, savedIds]
  );
  const current = deck[0] ?? null;
  const next = deck[1] ?? null;

  const handleAction = useCallback(
    (action: SwipeAction) => {
      if (!current) {
        return;
      }

      const createsMatch =
        action === "interest" &&
        Boolean(current.mutualInterest) &&
        !matches.some((match) => match.candidateId === current.id);
      actOnCandidate(current, action, createsMatch);
      setDrag({ x: 0, y: 0, active: false });

      if (createsMatch) {
        setMatchedProfile(current);
      }
    },
    [actOnCandidate, current, matches]
  );

  const handlePointerDown: PointerEventHandler<HTMLElement> = (event) => {
    if (!current || swipeMotion) {
      return;
    }
    pointerStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ x: 0, y: 0, active: true });
  };

  const handlePointerMove: PointerEventHandler<HTMLElement> = (event) => {
    if (!pointerStart.current) {
      return;
    }
    setDrag({
      x: event.clientX - pointerStart.current.x,
      y: event.clientY - pointerStart.current.y,
      active: true
    });
  };

  const finishGesture = useCallback(() => {
    if (!pointerStart.current) {
      return;
    }

    pointerStart.current = null;
    const horizontal = Math.abs(drag.x);
    const vertical = Math.abs(drag.y);

    if (horizontal > 90 && horizontal > vertical) {
      handleAction(drag.x > 0 ? "interest" : "pass");
      return;
    }

    if (drag.y < -90 && vertical > horizontal) {
      handleAction("save");
      return;
    }

    setDrag({ x: 0, y: 0, active: false });
  }, [drag.x, drag.y, handleAction]);

  const animateAction = useCallback(
    (action: SwipeAction) => {
      if (!current || swipeMotion) {
        return;
      }

      if (reducedMotion) {
        handleAction(action);
        return;
      }

      setDrag({ x: 0, y: 0, active: false });
      setSwipeMotion(action);
      window.setTimeout(() => {
        handleAction(action);
        setSwipeMotion(null);
      }, 280);
    },
    [current, handleAction, reducedMotion, swipeMotion]
  );

  useEffect(() => {
    const storedSuggestion = window.sessionStorage.getItem("mutualizm.signupSuggestion");
    if (!storedSuggestion) {
      return;
    }

    try {
      const suggestion = JSON.parse(storedSuggestion) as {
        mainSkill?: string;
        skills?: string[];
        role?: string;
      };
      const bestCandidate = findBestSuggestion(suggestion);
      if (bestCandidate) {
        setSuggestedProfile(bestCandidate);
      }
    } catch {
      // The suggestion payload is optional UI state; ignore malformed session data.
    } finally {
      window.sessionStorage.removeItem("mutualizm.signupSuggestion");
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      if (event.key === "Escape") {
        setDetailProfile(null);
        setMatchedProfile(null);
        setSuggestedProfile(null);
        setFilterOpen(false);
      }

      if (!current) {
        return;
      }

      if (event.key === "ArrowLeft") {
        rewindLast();
      }
      if (event.key === "ArrowRight") {
        animateAction("pass");
      }
      if (event.key === "ArrowUp") {
        animateAction("save");
      }
      if (event.key === "Backspace" || event.key.toLowerCase() === "r") {
        rewindLast();
        setRewindAnim(true);
        window.setTimeout(() => setRewindAnim(false), 450);
      }
      if (event.key === "Enter") {
        setDetailProfile(current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [animateAction, current, rewindLast]);

  const tilt = Math.max(-12, Math.min(12, drag.x / 16));
  const dragStyle =
    drag.active || drag.x || drag.y
      ? ({
          transform: reducedMotion
            ? undefined
            : `translate(${drag.x}px, ${drag.y}px) rotate(${tilt}deg)`,
          transition: drag.active ? "none" : undefined
        } as CSSProperties)
      : undefined;
  const actionHint = getActionHint(drag.x, drag.y);

  return (
    <div className="page-stack discover-page page-transition">
      <PageHeader
        eyebrow={t.discoverEyebrow}
        title={t.discoverTitle}
        action={
          <div className="header-actions mobile-only">
            <Button variant="ghost" onClick={() => setFilterOpen(true)}>
              <Filter size={18} aria-hidden="true" />
              {t.filters}
            </Button>
          </div>
        }
      />

      <ActiveFilterChips />

      <div className="deck-zone">
        {next ? <CandidateCard profile={next} className="next-card" isPreview /> : null}
        {current ? (
          <CandidateCard
            profile={current}
            className={`active-card ${swipeMotion ? `swiping-${swipeMotion}` : ""} ${rewindAnim ? "card-rewind-anim" : ""}`}
            style={dragStyle}
            actionHint={actionHint}
            onExpand={() => setDetailProfile(current)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishGesture}
            onPointerCancel={finishGesture}
            onPass={() => animateAction("pass")}
            onSave={() => animateAction("save")}
            onInterest={() => animateAction("interest")}
          />
        ) : (
          <EmptyState
            title={filteredProfiles.length === 0 ? "No candidates match these filters" : "Deck complete"}
            body={
              filteredProfiles.length === 0
                ? "Try clearing a filter or selecting a broader skill category."
                : "You have gone through the current mock deck. Reset it to run the demo again."
            }
            action={
              filteredProfiles.length === 0 ? (
                <ClearFiltersButton />
              ) : (
                <Button variant="primary" onClick={resetDeck}>
                  <RefreshCw size={18} />
                  {t.resetDemo}
                </Button>
              )
            }
          />
        )}
      </div>

      <p className="shortcut-note">
        Desktop shortcuts: Left rewind, Right next, Up save, R rewind, Enter details, Esc close.
      </p>

      {detailProfile ? (
        <CandidateDetailSheet profile={detailProfile} onClose={() => setDetailProfile(null)} />
      ) : null}

      {matchedProfile ? (
        <MatchModal
          candidate={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onContinue={() => setMatchedProfile(null)}
        />
      ) : null}

      {suggestedProfile ? (
        <SignupSuggestionModal
          candidate={suggestedProfile}
          onClose={() => setSuggestedProfile(null)}
          onViewProfile={() => {
            setDetailProfile(suggestedProfile);
            setSuggestedProfile(null);
          }}
        />
      ) : null}

      {filterOpen ? createPortal(
        <div className="overlay" role="presentation" onClick={() => setFilterOpen(false)}>
          <div className="bottom-sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <FilterPanel variant="mobile" onApplied={() => setFilterOpen(false)} />
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}

function SwipeActionButtons({
  disabled,
  onPass,
  onSave,
  onInterest,
  onRewind,
  onExpand
}: {
  disabled: boolean;
  onPass: () => void;
  onSave: () => void;
  onInterest: () => void;
  onRewind: () => void;
  onExpand: () => void;
}) {
  return (
    <div className="swipe-actions" aria-label="Profile actions">
      <Button variant="circle" aria-label="Rewind previous profile" onClick={onRewind}>
        <RotateCcw size={20} aria-hidden="true" />
      </Button>
      <Button variant="circleDanger" aria-label="Pass profile" disabled={disabled} onClick={onPass}>
        <X size={22} aria-hidden="true" />
      </Button>
      <Button variant="circle" aria-label="Expand profile details" disabled={disabled} onClick={onExpand}>
        <Eye size={20} aria-hidden="true" />
      </Button>
      <Button variant="circle" aria-label="Save profile" disabled={disabled} onClick={onSave}>
        <Bookmark size={20} aria-hidden="true" />
      </Button>
      <Button
        variant="circlePrimary"
        aria-label="Show interest in profile"
        disabled={disabled}
        onClick={onInterest}
      >
        <Heart size={22} aria-hidden="true" />
      </Button>
    </div>
  );
}

function OnboardingPage() {
  const { profile, setProfile, addToast } = useSymbio();
  const t = useTranslations();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<CandidateProfile>(() => ({
    ...profile,
    experiences: profile.experiences.length ? profile.experiences : [emptyExperience],
    portfolioLinks: profile.portfolioLinks.length
      ? profile.portfolioLinks
      : [
          { label: "GitHub", url: "" },
          { label: "Figma", url: "" },
          { label: "Portfolio", url: "" }
        ]
  }));
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const steps = [
    t.stepIdentity,
    t.stepCampus,
    t.stepRole,
    t.stepSkills,
    t.stepSummary,
    t.stepExperience,
    t.stepTimeline,
    t.stepPortfolio,
    t.stepAvailability,
    t.stepPreview
  ];
  const errors = validateOnboardingStep(step, draft, t);

  const goNext = () => {
    if (errors.length) {
      setTouched(true);
      return;
    }

    setTouched(false);
    if (step === steps.length - 1) {
      setProfile({ ...draft, id: "me", mutualInterest: false });
      addToast(t.profileReadyTitle, t.profileReadyBody);
      window.sessionStorage.setItem(
        "mutualizm.signupSuggestion",
        JSON.stringify({
          mainSkill: draft.mainSkill,
          skills: draft.skills.map((skill) => skill.name),
          role: draft.role
        })
      );
      navigate("/discover");
      return;
    }
    setStep((current) => current + 1);
  };

  const goBack = () => {
    setTouched(false);
    setStep((current) => Math.max(0, current - 1));
  };

  return (
    <div className="onboarding-shell page-transition">
      <header className="onboarding-top">
        <Link to="/" className="brand-mark">
          <span className="brand-icon">S</span>
          <span>Mutualizm</span>
        </Link>
        <Link to="/discover" className="text-link">
          {t.skipToDemo}
        </Link>
      </header>

      <main className="onboarding-grid">
        <section className="onboarding-form">
          <StepProgress steps={steps} activeStep={step} />
          <div className="form-panel">
            <p className="eyebrow">{t.stepOf} {step + 1} {t.of} 10</p>
            <h1>{steps[step]}</h1>
            <OnboardingStep step={step} draft={draft} setDraft={setDraft} />
            {touched && errors.length ? (
              <div className="error-box" role="alert">
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            ) : null}
            <div className="form-actions">
              <Button variant="secondary" onClick={goBack} disabled={step === 0}>
                <ArrowLeft size={18} aria-hidden="true" />
                {t.back}
              </Button>
              <Button variant="primary" onClick={goNext}>
                {step === steps.length - 1 ? t.enterDiscover : t.continue}
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        <aside className="preview-panel">
          <div className="sticky-preview">
            <p className="eyebrow">{t.liveCardPreview}</p>
            <CandidateCard profile={draft} isPreview onExpand={() => undefined} />
          </div>
        </aside>
      </main>
    </div>
  );
}

function OnboardingStep({
  step,
  draft,
  setDraft
}: {
  step: number;
  draft: CandidateProfile;
  setDraft: Dispatch<SetStateAction<CandidateProfile>>;
}) {
  const t = useTranslations();
  const update = (patch: Partial<CandidateProfile>) =>
    setDraft((current) => ({ ...current, ...patch }));

  if (step === 0) {
    return (
      <div className="field-grid">
        <TextField
          label={t.fullName}
          value={draft.name}
          onChange={(value) => update({ name: value })}
          placeholder="Alya Putri"
        />
        <PhotoUploadField
          label={t.profilePhoto}
          value={draft.avatarUrl ?? ""}
          position={draft.avatarPosition ?? "center 42%"}
          onChange={(value) => update({ avatarUrl: value })}
          onPositionChange={(value) => update({ avatarPosition: value })}
        />
        <SelectField
          label={t.avatarColor}
          value={draft.accent}
          onChange={(value) => update({ accent: value })}
          options={[
            { label: t.referenceYellow, value: "#ffc629" },
            { label: t.softHoney, value: "#ffe48a" },
            { label: t.warmCream, value: "#fff3c4" },
            { label: t.neutralGray, value: "#777777" }
          ]}
        />
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="field-grid">
        <TextField
          label={t.campus}
          value={draft.campus}
          onChange={(value) => update({ campus: value })}
          placeholder="Telkom University"
        />
        <TextField
          label={t.facultyProgram}
          value={draft.program}
          onChange={(value) => update({ program: value })}
          placeholder="S1 Sistem Informasi"
        />
      </div>
    );
  }

  if (step === 2) {
    const baseRoles = ["Technical", "Business", "Design"];
    const isCustomRole = !baseRoles.includes(draft.role);
    const uniqueSkillOptions = uniqueSkills();
    const isCustomSkill = Boolean(draft.mainSkill) && !uniqueSkillOptions.includes(draft.mainSkill);

    return (
      <div className="field-grid">
        <div className="field-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
          <label className="field-label uppercase">{t.mainRole}</label>
          <div className="role-card-grid">
            {[
              { id: "Technical", label: t.technicalRole, icon: "code", color: "dev" },
              { id: "Business", label: t.businessRole, icon: "trending_up", color: "biz" },
              { id: "Design", label: t.designRole, icon: "palette", color: "design" },
              { id: "Other", label: t.otherRole, icon: "extension", color: "other" }
            ].map((roleCard) => (
              <div
                key={roleCard.id}
                className={`role-card ${
                  (roleCard.id === "Other" ? isCustomRole : draft.role === roleCard.id)
                    ? "selected"
                    : ""
                }`}
                onClick={() => update({ role: roleCard.id === "Other" ? "" : roleCard.id })}
              >
                <span className={`material-symbols-outlined text-cat-${roleCard.color}`}>
                  {roleCard.icon}
                </span>
                <span className="role-card-label">{roleCard.label}</span>
              </div>
            ))}
          </div>
        </div>
        {isCustomRole ? (
          <TextField
            label={t.customRole}
            value={draft.role}
            onChange={(value) => update({ role: value })}
            placeholder={t.customRolePlaceholder}
          />
        ) : null}
        <SelectField
          label={t.mainSkillLabel}
          value={isCustomSkill ? "__custom__" : draft.mainSkill}
          onChange={(value) =>
            setDraft((current) => ({
              ...current,
              mainSkill: value === "__custom__" ? "" : value,
              skills: value === "__custom__" ? current.skills : ensureSkillSelected(current.skills, value)
            }))
          }
          options={[
            ...uniqueSkillOptions.map((skillName) => ({ label: skillName, value: skillName })),
            { label: t.otherSkill, value: "__custom__" }
          ]}
        />
        {isCustomSkill || draft.mainSkill === "" ? (
          <TextField
            label={t.customMainSkill}
            value={draft.mainSkill}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                mainSkill: value,
                skills: value ? ensureSkillSelected(current.skills, value) : current.skills
              }))
            }
            placeholder={t.customMainSkillPlaceholder}
          />
        ) : null}
        <MultiChipField
          label={t.collaborationType}
          values={draft.collaborationGoals}
          options={collaborationGoalOptions}
          onChange={(values) => update({ collaborationGoals: values })}
        />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="field-grid">
        <SkillChecklist
          selected={draft.skills}
          onChange={(skills) => update({ skills })}
          helper={t.skillHelper}
        />
      </div>
    );
  }

  if (step === 4) {
    return (
      <TextAreaField
        label={t.profileSummaryLabel}
        value={draft.profileSummary}
        onChange={(value) => update({ profileSummary: value })}
        minRows={5}
        maxLength={180}
        hint={`${draft.profileSummary.length}/180 ${t.profileSummaryHint}.`}
        placeholder={t.profileSummaryPlaceholder}
      />
    );
  }

  if (step === 5) {
    return (
      <TextAreaField
        label={t.experienceSummaryLabel}
        value={draft.experienceSummary}
        onChange={(value) => update({ experienceSummary: value })}
        minRows={5}
        maxLength={240}
        hint={`${draft.experienceSummary.length}/240 ${t.experienceSummaryHint}`}
        placeholder={t.experienceSummaryPlaceholder}
      />
    );
  }

  if (step === 6) {
    return (
      <ExperienceEditor
        experience={draft.experiences[0] ?? emptyExperience}
        onChange={(experience) => update({ experiences: [{ ...experience, id: "draft-exp-1" }] })}
      />
    );
  }

  if (step === 7) {
    return (
      <PortfolioEditor
        links={draft.portfolioLinks}
        onChange={(portfolioLinks) => update({ portfolioLinks })}
      />
    );
  }

  if (step === 8) {
    return (
      <div className="field-grid">
        <SelectField
          label={t.availabilityLabel}
          value={draft.availability}
          onChange={(value) => update({ availability: value as CandidateProfile["availability"] })}
          options={[
            { label: localizeAvailabilityLabel("available", t), value: "available" },
            { label: localizeAvailabilityLabel("limited", t), value: "limited" },
            { label: localizeAvailabilityLabel("busy", t), value: "busy" }
          ]}
        />
        <SelectField
          label={t.statusBadge}
          value={draft.statusLabel ?? ""}
          onChange={(value) => update({ statusLabel: value })}
          options={[
            { label: t.defaultStatus, value: "" },
            { label: t.lookingForProject, value: "Looking for project" },
            { label: t.availableThisWeek, value: "Available this week" },
            { label: t.busyMessageFirst, value: "Busy, message first" }
          ]}
        />
        <TextAreaField
          label={t.availabilityDetails}
          value={draft.availabilityDetail}
          onChange={(value) => update({ availabilityDetail: value })}
          minRows={3}
          placeholder={t.availabilityPlaceholder}
        />
      </div>
    );
  }

  return (
    <div className="field-grid">
      <MultiChipField
        label={t.lookingForLabel}
        values={draft.lookingFor}
        options={roleOptions}
        onChange={(values) => update({ lookingFor: values })}
      />
      <TextAreaField
        label={t.suggestedFirstMessage}
        value={draft.suggestedMessage}
        onChange={(value) => update({ suggestedMessage: value })}
        minRows={4}
        placeholder={t.suggestedFirstMessagePlaceholder}
      />
      <div className="preview-inline mobile-only">
        <CandidateCard profile={draft} isPreview />
      </div>
    </div>
  );
}

function ProfilePage() {
  const { profile, setProfile, matches, savedIds, language, setLanguage } = useSymbio();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const t = useTranslations();

  return (
    <div className="profile-phone page-stack page-transition">
      <section className="profile-header-bar" aria-label="Profile actions">
        <Avatar profile={profile} size="xs" />
        <strong>{profile.name}</strong>
        <CheckCircle size={16} aria-label={t.verified} />
        <span className="profile-bar-spacer" />
        <button aria-label="Open profile QR code" onClick={() => setQrOpen(true)}>
          <QrCode size={21} aria-hidden="true" />
        </button>
        <button aria-label="Open settings" onClick={() => setSettingsOpen(true)}>
          <Settings size={22} aria-hidden="true" />
        </button>
        <button aria-label={t.logout} onClick={() => setLogoutOpen(true)} title={t.logout} style={{ color: 'var(--danger)', marginLeft: '8px', border: 'none', background: 'transparent' }}>
          <LogOut size={22} aria-hidden="true" />
        </button>
      </section>

      <section className="profile-stats-strip" aria-label="Profile stats">
        <span>
          <strong>{matches.length}</strong>
          {t.statsMatches}
        </span>
        <span>
          <strong>{savedIds.length}</strong>
          {t.statsSaved}
        </span>
        <span>
          <strong>{profile.skills.length}</strong>
          {t.statsSkills}
        </span>
      </section>

      <section className="profile-card-summary">
        <div>
          <p className="eyebrow">{t.yourSymbioCard}</p>
          <h2>{profile.mainSkill}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '4px 0 12px' }}>
            {profile.campus} · {profile.program} · {localizeRoleLabel(profile.role, t)}
          </p>
          <p>{localizeProfileSummary(profile, t)}</p>
        </div>
        <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
          {t.edit}
        </Button>
      </section>

      <div className="profile-detail-grid">
        <section className="profile-info-panel">
          <div className="rail-heading">
            <h2>{t.statusCollaboration}</h2>
            <AvailabilityBadge availability={profile.availability} label={profile.statusLabel} />
          </div>
          <p>{localizeAvailabilityDetail(profile, t) || t.noAvailabilityDetail}</p>
        </section>

        <section className="profile-info-panel">
          <h2>{t.mainSkillsTitle}</h2>
          <div className="chip-row">
            {profile.skills.length ? profile.skills.map((skillItem) => (
              <Chip key={`${skillItem.name}-${skillItem.level}`}>{skillItem.name}</Chip>
            )) : <span className="muted-text">{t.noSkillsYet}</span>}
          </div>
        </section>

        <section className="profile-info-panel">
          <h2>{t.lookingForTitle}</h2>
          <div className="chip-row">
            {profile.lookingFor.length ? profile.lookingFor.map((role) => (
              <Chip key={role} tone="soft">{localizeRoleLabel(role, t)}</Chip>
            )) : <span className="muted-text">{t.noLookingForYet}</span>}
          </div>
        </section>

        <section className="profile-info-panel">
          <h2>{t.experienceTitle}</h2>
          {profile.experiences.length ? profile.experiences.slice(0, 2).map((experience) => (
            <article className="profile-experience-card" key={experience.id}>
              <strong>{localizeExperienceText(experience.title, t)}</strong>
              <span>{localizeExperienceText(experience.organization, t)} · {localizeTimeLabel(experience.period || t.recent, t)}</span>
              <p>{localizeExperienceText(experience.description, t)}</p>
            </article>
          )) : <p className="muted-text">{t.noExperienceYet}</p>}
        </section>

        <section className="profile-info-panel">
          <h2>{t.portfolioTitle}</h2>
          <div className="portfolio-list">
            {profile.portfolioLinks.filter((link) => link.url).length ? profile.portfolioLinks.filter((link) => link.url).map((link) => (
              <a href={link.url} key={`${link.label}-${link.url}`} target="_blank" rel="noreferrer">
                <LinkIcon size={16} aria-hidden="true" />
                {link.label}
              </a>
            )) : <span className="muted-text">{t.noPortfolioYet}</span>}
          </div>
        </section>
      </div>

      {false && settingsOpen ? (
        <div className="overlay" role="presentation" onClick={() => setSettingsOpen(false)}>
          <div className="modal-sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={{
            background: 'var(--surface)',
            padding: '24px',
            borderRadius: 'var(--radius)',
            width: 'min(480px, 90vw)',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--ink)' }}>{t.settingsTitle}</h2>
            
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--muted)' }}>{t.name}</label>
              <input 
                type="text" 
                defaultValue={profile.name} 
                id="settings-name-input"
                className="input-field"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--ink)'
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--muted)' }}>{t.photoUrl}</label>
              <input 
                type="text" 
                defaultValue={profile.avatarUrl ?? ""} 
                id="settings-avatar-input"
                className="input-field"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--ink)'
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--muted)' }}>{t.language}</label>
              <select 
                defaultValue={language} 
                id="settings-language-input"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--ink)'
                }}
              >
                <option value="en">{t.english}</option>
                <option value="id">{t.indonesian}</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--muted)' }}>{t.campus}</label>
              <input 
                type="text" 
                defaultValue={profile.campus} 
                id="settings-campus-input"
                className="input-field"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--ink)'
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--muted)' }}>{t.program}</label>
              <input 
                type="text" 
                defaultValue={profile.program} 
                id="settings-program-input"
                className="input-field"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--ink)'
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--muted)' }}>{t.preferredRole}</label>
              <input 
                type="text" 
                defaultValue={profile.role} 
                id="settings-role-input"
                className="input-field"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--ink)'
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--muted)' }}>{t.mainSkill}</label>
              <input 
                type="text" 
                defaultValue={profile.mainSkill} 
                id="settings-skill-input"
                className="input-field"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--ink)'
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--muted)' }}>{t.bio}</label>
              <textarea 
                defaultValue={profile.profileSummary} 
                id="settings-bio-input"
                rows={3}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--ink)',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
                {t.cancel}
              </Button>
              <Button variant="primary" onClick={() => {
                const nameEl = document.getElementById("settings-name-input") as HTMLInputElement;
                const avatarEl = document.getElementById("settings-avatar-input") as HTMLInputElement;
                const langEl = document.getElementById("settings-language-input") as HTMLSelectElement;
                const campusEl = document.getElementById("settings-campus-input") as HTMLInputElement;
                const programEl = document.getElementById("settings-program-input") as HTMLInputElement;
                const roleEl = document.getElementById("settings-role-input") as HTMLInputElement;
                const skillEl = document.getElementById("settings-skill-input") as HTMLInputElement;
                const bioEl = document.getElementById("settings-bio-input") as HTMLTextAreaElement;

                if (nameEl && langEl) {
                  setProfile(prev => ({
                    ...prev,
                    name: nameEl.value,
                    avatarUrl: avatarEl ? avatarEl.value : prev.avatarUrl,
                    campus: campusEl ? campusEl.value : prev.campus,
                    program: programEl ? programEl.value : prev.program,
                    role: roleEl ? roleEl.value : prev.role,
                    mainSkill: skillEl ? skillEl.value : prev.mainSkill,
                    profileSummary: bioEl ? bioEl.value : prev.profileSummary
                  }));
                  setLanguage(langEl.value as "en" | "id");
                  setSettingsOpen(false);
                }
              }}>
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      {settingsOpen ? (
        <SettingsDrawer onClose={() => setSettingsOpen(false)} onLogoutRequest={() => setLogoutOpen(true)} />
      ) : null}
      {qrOpen ? <ProfileQrModal profile={profile} onClose={() => setQrOpen(false)} /> : null}
      {logoutOpen ? <LogoutConfirmModal onClose={() => setLogoutOpen(false)} /> : null}
    </div>
  );
}

function MatchesPage() {
  const { matches, removeMatch, addToast } = useSymbio();
  const t = useTranslations();
  const [selectedId, setSelectedId] = useState(matches[0]?.id ?? "");
  const [openMenuId, setOpenMenuId] = useState("");
  const [detailProfile, setDetailProfile] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    if (!matches.some((match) => match.id === selectedId)) {
      setSelectedId(matches[0]?.id ?? "");
    }
  }, [matches, selectedId]);

  if (!matches.length) {
    return (
      <div className="page-stack">
        <BeelineIntro />
        <EmptyState
          title={t.noMatchesYet}
          body={t.noMatchesBody}
          action={
            <Link className="button button-primary" to="/discover">
              {t.discoverProfiles}
            </Link>
          }
        />
      </div>
    );
  }

  const selected = matches.find((match) => match.id === selectedId) ?? matches[0];
  const selectedCandidate = getCandidate(selected.candidateId);
  const showPrototypeActionToast = (title: string, body: string) => addToast(title, body);

  return (
    <div className="page-stack beeline-page page-transition">
      <BeelineIntro />
      <div className="matches-grid">
        <section className="match-list" aria-label="Match list">
          {matches.map((match) => {
            const candidate = getCandidate(match.candidateId);
            if (!candidate) {
              return null;
            }

            return (
              <article
                className={`match-row ${match.id === selected.id ? "selected" : ""}`}
                key={match.id}
                onClick={() => setSelectedId(match.id)}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setSelectedId(match.id);
                  }
                }}
                style={candidate.avatarUrl ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.78)), url(${candidate.avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              >
                <Avatar profile={candidate} size="sm" />
                <span>
                  <strong>{candidate.name}</strong>
                  <small>{localizeRoleLabel(candidate.role, t)} · {candidate.mainSkill}</small>
                  <em>{localizeMatchMessage(match.latestMessage, t)}</em>
                </span>
                {match.unread ? <b>{match.unread}</b> : null}
                <div className="match-quick-actions">
                  <Link
                    className="match-chat-button"
                    to={`/chat/${match.id}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t.chat}
                  </Link>
                  <button
                    type="button"
                    className="match-profile-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDetailProfile(candidate);
                    }}
                  >
                    {t.profile}
                  </button>
                </div>
                <div className="match-menu" onClick={(event) => event.stopPropagation()}>
                  <button
                    type="button"
                    className="match-menu-trigger"
                    aria-label={t.matchActions}
                    aria-expanded={openMenuId === match.id}
                    onClick={() => setOpenMenuId((current) => (current === match.id ? "" : match.id))}
                  >
                    <MoreVertical size={18} aria-hidden="true" />
                  </button>
                  {openMenuId === match.id ? (
                    <div className="match-menu-panel">
                      <button type="button" onClick={() => { setDetailProfile(candidate); setOpenMenuId(""); }}>
                        <Eye size={15} aria-hidden="true" />
                        {t.viewProfile}
                      </button>
                      <button type="button" onClick={() => { removeMatch(match.id); setOpenMenuId(""); }}>
                        <Trash2 size={15} aria-hidden="true" />
                        {t.removeMatch}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          showPrototypeActionToast(t.reportQueuedTitle, t.reportQueuedBody);
                          setOpenMenuId("");
                        }}
                      >
                        <Flag size={15} aria-hidden="true" />
                        {t.reportUser}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          showPrototypeActionToast(t.blockQueuedTitle, t.blockQueuedBody);
                          setOpenMenuId("");
                        }}
                      >
                        <X size={15} aria-hidden="true" />
                        {t.blockUser}
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      </div>
      {detailProfile ? (
        <CandidateDetailSheet profile={detailProfile} onClose={() => setDetailProfile(null)} />
      ) : null}
    </div>
  );
}

function BeelineIntro() {
  const t = useTranslations();
  return (
    <section className="beeline-intro">
      <Heart size={28} aria-hidden="true" />
      <h1>{t.matchesTitle}</h1>
      <p>
        {t.matchReadyCopy}
      </p>
      <span className="bee-orbit bee-one">✦</span>
      <span className="bee-orbit bee-two">✦</span>
    </section>
  );
}

function ChatPage() {
  const { matches } = useSymbio();
  const t = useTranslations();
  const { matchId } = useParams();
  const match = matches.find((item) => item.id === matchId);
  const candidate = match ? getCandidate(match.candidateId) : null;

  if (!match || !candidate) {
    return (
      <div className="page-stack page-transition">
        <PageHeader eyebrow={t.chat} title={t.conversationNotFound} />
        <EmptyState
          title={t.noChatSelected}
          body={t.noChatSelectedBody}
          action={
            <Link className="button button-primary" to="/matches">
              {t.viewMatches}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-stack chat-page page-transition">
      <PageHeader eyebrow={t.chatPreview} title={`${t.conversationWith} ${candidate.name}`} />
      <ChatWindow match={match} candidate={candidate} />
    </div>
  );
}

function SavedPage() {
  const { savedIds, removeSaved, matches, setMatches, setChats } = useSymbio();
  const [detailProfile, setDetailProfile] = useState<CandidateProfile | null>(null);
  const navigate = useNavigate();
  const t = useTranslations();

  const savedProfiles = savedIds
    .map((id) => getCandidate(id))
    .filter((candidate): candidate is CandidateProfile => Boolean(candidate));

  const startChat = (candidate: CandidateProfile) => {
    let existingMatch = matches.find((m) => m.candidateId === candidate.id);
    if (!existingMatch) {
      existingMatch = createMatchFor(candidate);
      setMatches((prev) => [existingMatch!, ...prev]);
      setChats((prev) => ({
        ...prev,
        [existingMatch!.id]: [
          {
            id: `saved-init-${candidate.id}`,
            sender: "them",
            text: t.savedChatStarter,
            timestamp: "Just now"
          }
        ]
      }));
    }
    navigate(`/chat/${existingMatch.id}`);
  };

  return (
    <div className="page-stack page-transition">
      <PageHeader eyebrow={t.savedEyebrow} title={t.savedDesc} />
      {savedProfiles.length ? (
        <div className="saved-grid">
          {savedProfiles.map((candidate) => (
            <article className="saved-card" key={candidate.id}>
              <div className="saved-card-top">
                <Avatar profile={candidate} size="md" />
                <div>
                  <h2>{candidate.name}</h2>
                  <p>{localizeRoleLabel(candidate.role, t)} · {candidate.mainSkill}</p>
                </div>
                <AvailabilityBadge availability={candidate.availability} label={candidate.statusLabel} />
              </div>
              <p className="clamp-3">{localizeProfileSummary(candidate, t)}</p>
              <div className="chip-row">
                {candidate.skills.slice(0, 3).map((skillItem) => (
                  <Chip key={skillItem.name}>{skillItem.name}</Chip>
                ))}
              </div>
              <div className="card-actions-row">
                <Button variant="primary" onClick={() => startChat(candidate)}>
                  <MessageCircle size={18} aria-hidden="true" />
                  {t.chat}
                </Button>
                <Button variant="secondary" onClick={() => setDetailProfile(candidate)}>
                  <Eye size={18} aria-hidden="true" />
                  {t.details}
                </Button>
                <Button variant="ghostDanger" onClick={() => removeSaved(candidate.id)}>
                  <Trash2 size={18} aria-hidden="true" />
                  {t.remove}
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title={t.noSavedTitle}
          body={t.noSavedBody}
          action={
            <Link className="button button-primary" to="/discover">
              {t.browseCandidates}
            </Link>
          }
        />
      )}
      {detailProfile ? (
        <CandidateDetailSheet profile={detailProfile} onClose={() => setDetailProfile(null)} />
      ) : null}
    </div>
  );
}

function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useSymbio();
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const t = useTranslations();

  return (
    <div className="page-stack page-transition">
      <PageHeader
        eyebrow={t.alertsEyebrow}
        title={t.alertsDesc}
        action={
          <Button variant="secondary" onClick={markAllNotificationsRead} disabled={!unreadCount}>
            {t.markAllRead}
          </Button>
        }
      />
      <div className="notification-list">
        {notifications.map((notification) => {
          const displayedNotification = localizeNotification(notification, t);
          return (
            <article
              className={`notification-card ${notification.read ? "read" : "unread"}`}
              key={notification.id}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                markNotificationRead(notification.id);
                setSelectedNotification(notification);
              }}
            >
              <span className="notification-type">{displayedNotification.type}</span>
              <div>
                <h2>{displayedNotification.title}</h2>
                <p>{displayedNotification.body}</p>
                <small>{displayedNotification.time}</small>
              </div>
              {!notification.read ? (
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(notification.id);
                  }}
                >
                  {t.markRead}
                </Button>
              ) : null}
            </article>
          );
        })}
      </div>

      {selectedNotification ? createPortal(
        <div className="overlay notification-detail-overlay" role="presentation" onClick={() => setSelectedNotification(null)}>
          <div className="modal-sheet notification-detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <span className="notification-detail-type">
              {localizeNotification(selectedNotification, t).type}
            </span>
            <h2>{localizeNotification(selectedNotification, t).title}</h2>
            <p>
              {localizeNotification(selectedNotification, t).body}
            </p>
            <small>{localizeNotification(selectedNotification, t).time}</small>
            <div className="notification-detail-actions">
              <Button variant="primary" onClick={() => setSelectedNotification(null)}>
                {t.close}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}

function ProjectsPage() {
  const t = useTranslations();
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[number] | null>(null);
  return (
    <div className="page-stack page-transition">
      <PageHeader
        eyebrow={t.projectsEyebrow}
        title={t.projectsDesc}
      />
      <div className="project-grid">
        {mockProjects.map((project) => {
          const displayedProject = localizeProject(project, t);
          return (
          <article className="project-card" key={project.id}>
            <span className="project-status">{displayedProject.status}</span>
            <h2>{displayedProject.title}</h2>
            <p>{displayedProject.summary}</p>
            <div>
              <strong>{t.neededRoles}</strong>
              <div className="chip-row">
                {project.neededRoles.map((role) => (
                  <Chip key={role}>{localizeRoleLabel(role, t)}</Chip>
                ))}
              </div>
            </div>
            <div>
              <strong>{t.skills}</strong>
              <div className="chip-row">
                {project.skills.map((skillName) => (
                  <Chip key={skillName} tone="soft">
                    {skillName}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="project-footer">
              <span>{displayedProject.deadline}</span>
              <Button variant="secondary" onClick={() => setSelectedProject(project)}>{t.viewProject}</Button>
            </div>
          </article>
          );
        })}
      </div>
      {selectedProject ? createPortal(
        <div className="overlay" role="presentation" onClick={() => setSelectedProject(null)}>
          <div className="project-detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{localizeProject(selectedProject, t).title}</h2>
              <button type="button" onClick={() => setSelectedProject(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <span className="chip">{localizeProject(selectedProject, t).status}</span>
            <p>{localizeProject(selectedProject, t).summary}</p>
            <div>
              <strong>{t.neededRoles}</strong>
              <div className="chip-row" style={{ marginTop: 6 }}>
                {selectedProject.neededRoles.map((role) => (
                  <Chip key={role}>{localizeRoleLabel(role, t)}</Chip>
                ))}
              </div>
            </div>
            <div>
              <strong>{t.skills}</strong>
              <div className="chip-row" style={{ marginTop: 6 }}>
                {selectedProject.skills.map((skillName) => (
                  <Chip key={skillName} tone="soft">{skillName}</Chip>
                ))}
              </div>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{localizeProject(selectedProject, t).deadline}</p>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}

function ChatWindow({
  match,
  candidate,
  embedded = false
}: {
  match: MatchRecord;
  candidate: CandidateProfile;
  embedded?: boolean;
}) {
  const { chats, sendMessage, setChats, setMatches, addToast } = useSymbio();
  const t = useTranslations();
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingId, setEditingId] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const messages = chats[match.id] ?? [];

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 80);
  };

  const latestOwnMessage = [...messages].reverse().find((chatMessage) => chatMessage.sender === "me");

  const updateMatchPreview = (nextMessages: ChatMessage[]) => {
    const latestMessage = nextMessages[nextMessages.length - 1];
    setMatches((current) =>
      current.map((currentMatch) =>
        currentMatch.id === match.id
          ? { ...currentMatch, latestMessage: latestMessage?.text ?? "", unread: 0 }
          : currentMatch
      )
    );
  };

  const updateMessage = (messageId: string, nextText: string) => {
    setChats((current) => {
      const nextMessages = (current[match.id] ?? []).map((chatMessage) =>
        chatMessage.id === messageId ? { ...chatMessage, text: nextText } : chatMessage
      );
      updateMatchPreview(nextMessages);
      return { ...current, [match.id]: nextMessages };
    });
  };

  const deleteMessage = (messageId: string) => {
    setChats((current) => {
      const nextMessages = (current[match.id] ?? []).filter((chatMessage) => chatMessage.id !== messageId);
      updateMatchPreview(nextMessages);
      return { ...current, [match.id]: nextMessages };
    });
    addToast(t.messageDeletedTitle, t.messageDeletedBody);
  };

  const copyMessage = async (text: string) => {
    await navigator.clipboard?.writeText(text);
    addToast(t.messageCopiedTitle, t.messageCopiedBody);
  };

  const undoLastMessage = () => {
    if (!latestOwnMessage) {
      addToast(t.noMessageToUndo, t.noMessageToUndoBody);
      return;
    }
    deleteMessage(latestOwnMessage.id);
  };

  const submit = () => {
    const cleanText = message.trim();
    if (!cleanText) {
      return;
    }

    if (editingId) {
      updateMessage(editingId, cleanText);
      addToast(t.messageUpdatedTitle, t.messageUpdatedBody);
      setEditingId("");
      setMessage("");
      return;
    }

    const nextMessage = replyTo
      ? `${t.replyingTo} ${candidate.name.split(" ")[0]}: "${localizeChatMessage(replyTo.text, t)}"\n${cleanText}`
      : cleanText;

    sendMessage(match.id, nextMessage);
    setMessage("");
    setReplyTo(null);
  };

  return (
    <section className={`chat-window ${embedded ? "embedded" : ""}`}>
      <header className="chat-header">
        <Avatar profile={candidate} size="sm" />
        <div>
          <h2>{candidate.name}</h2>
          <p>
            <span className={candidate.online ? "online-dot" : "offline-dot"} />
            {candidate.online ? t.onlineNow : t.offline} · {candidate.mainSkill}
          </p>
        </div>
        <button className="button button-secondary" onClick={() => setShowProfile(true)}>{t.viewProfile}</button>
      </header>

      <div className="match-reason">
        <strong>{t.whyMatchWorks}</strong>
        {localizeMatchSummary(match, candidate, t).map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>

      <div className="message-list" aria-label="Chat messages" ref={listRef} onScroll={handleScroll} style={{ position: 'relative' }}>
        {messages.length ? (
          messages.map((chatMessage) => (
            <div className={`message ${chatMessage.sender}`} key={chatMessage.id}>
              <p>{localizeChatMessage(chatMessage.text, t)}</p>
              <span>{localizeTimeLabel(chatMessage.timestamp, t)}</span>
              <div className="message-actions">
                <button type="button" title={t.replyMessage} onClick={() => setReplyTo(chatMessage)}>
                  <Reply size={13} aria-hidden="true" />
                </button>
                <button type="button" title={t.copyMessage} onClick={() => copyMessage(chatMessage.text)}>
                  <Copy size={13} aria-hidden="true" />
                </button>
                {chatMessage.sender === "me" ? (
                  <>
                    <button
                      type="button"
                      title={t.editMessage}
                      onClick={() => {
                        setEditingId(chatMessage.id);
                        setMessage(chatMessage.text);
                        setReplyTo(null);
                      }}
                    >
                      <Edit size={13} aria-hidden="true" />
                    </button>
                    <button type="button" title={t.deleteMessage} onClick={() => deleteMessage(chatMessage.id)}>
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title={t.noMessagesYet}
            body={t.typeMessage}
          />
        )}
        <div className="typing-indicator" aria-label={`${candidate.name} ${t.isTyping}`}>
          <span />
          <span />
          <span />
          {candidate.name.split(" ")[0]} {t.isTyping}
        </div>
        {showScrollBtn ? (
          <button type="button" className="scroll-to-bottom-btn" onClick={scrollToBottom} aria-label="Scroll to bottom">
            <ChevronDown size={18} />
          </button>
        ) : null}
      </div>

      <div className="chat-input">
        {replyTo || editingId ? (
          <div className="chat-compose-context">
            <span>
              {editingId ? t.editingMessage : `${t.replyingTo} ${candidate.name.split(" ")[0]}`}
            </span>
            <button type="button" onClick={() => { setReplyTo(null); setEditingId(""); setMessage(""); }}>
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ) : null}
        <button type="button" className="chat-undo-button" title={t.undoMessage} onClick={undoLastMessage}>
          <Undo2 size={17} aria-hidden="true" />
        </button>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submit();
            }
          }}
          placeholder={t.typeMessage}
        />
        <Button variant="primary" onClick={submit}>
          <Send size={18} aria-hidden="true" />
          {t.send}
        </Button>
      </div>

      {showProfile ? (
        <div className="chat-profile-overlay" role="presentation" onClick={() => setShowProfile(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CandidateDetailSheet profile={candidate} onClose={() => setShowProfile(false)} />
          </div>
        </div>
      ) : null}
    </section>
  );
}


function getRoleCategory(role: string): "dev" | "design" | "biz" | "other" {
  if (!role) return "other";
  const r = role.toLowerCase();
  if (r.includes("tech") || r.includes("dev") || r.includes("code") || r.includes("programmer") || r.includes("iot") || r.includes("data") || r.includes("analyst") || r.includes("python") || r.includes("react")) {
    return "dev";
  }
  if (r.includes("design") || r.includes("ui") || r.includes("ux") || r.includes("figma") || r.includes("creative") || r.includes("wireframing")) {
    return "design";
  }
  if (r.includes("biz") || r.includes("business") || r.includes("strategy") || r.includes("strategist") || r.includes("pitch") || r.includes("marketing") || r.includes("product manager")) {
    return "biz";
  }
  return "other";
}

function CandidateCard({
  profile,
  className = "",
  style,
  actionHint,
  onExpand,
  isPreview = false,
  onPass,
  onSave,
  onInterest,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel
}: {
  profile: CandidateProfile;
  className?: string;
  style?: CSSProperties;
  actionHint?: string;
  onExpand?: () => void;
  isPreview?: boolean;
  onPass?: () => void;
  onSave?: () => void;
  onInterest?: () => void;
  onPointerDown?: PointerEventHandler<HTMLElement>;
  onPointerMove?: PointerEventHandler<HTMLElement>;
  onPointerUp?: PointerEventHandler<HTMLElement>;
  onPointerCancel?: PointerEventHandler<HTMLElement>;
}) {
  const t = useTranslations();
  const cat = getRoleCategory(profile.role);
  const cardStyle = { ...(style ?? {}), "--accent": `var(--category-${cat})` } as CSSProperties;
  const [expanded, setExpanded] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const localizedActionHint = localizeActionHint(actionHint, t);
  const topSkills = profile.skills.slice(0, 2);
  const interests = profile.collaborationGoals.length
    ? profile.collaborationGoals.slice(0, 2).map((goal) => localizeCollaborationGoal(goal, t)).join(", ")
    : profile.lookingFor.slice(0, 2).map((role) => localizeRoleLabel(role, t)).join(", ");
  const experienceLine =
    localizeExperienceSummary(profile, t) ||
    localizeExperienceText(profile.experiences[0]?.description || "", t) ||
    t.noExperienceYet;

  useEffect(() => {
    setExpanded(false);
  }, [profile.id]);

  return (
    <article
      className={`candidate-card ${className}`}
      style={cardStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      aria-label={`${profile.name}, ${localizeRoleLabel(profile.role, t)}, ${t.mainSkillLabel} ${profile.mainSkill}`}
    >
      {actionHint ? <div className={`action-hint ${actionHint.toLowerCase()}`}>{localizedActionHint}</div> : null}
      
      {/* Card Header Image Area */}
      <div className="card-cover">
        <img
          className="card-cover-image"
          src={profile.avatarUrl || "/profile-cover-rizky.jpg"}
          alt={profile.name}
          style={{ objectPosition: profile.avatarPosition || "center 43%" }}
          draggable={false}
        />
        <div className="cover-badge-wrap">
          <AvailabilityBadge availability={profile.availability} label={profile.statusLabel} />
        </div>
      </div>

      {/* Card Body (Scrollable content) */}
      <div className={`candidate-body ${expanded ? "expanded" : ""}`}>
        <div className="candidate-identity-row" onClick={onExpand} style={{ cursor: onExpand ? 'pointer' : 'default' }}>
          <h2>{profile.name || t.yourName}</h2>
          <p className={`candidate-role-subtitle text-cat-${cat}`}>
            {localizeRoleLabel(profile.role || t.mainRoleFallback, t).toUpperCase()}
          </p>
        </div>

        <div className="card-front-meta">
          <div className="chip-row">
            {(showAllSkills ? profile.skills : topSkills).map((skillItem) => (
              <Chip key={skillItem.name}>{skillItem.name}</Chip>
            ))}
            {!showAllSkills && profile.skills.length > 2 ? (
              <button type="button" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setShowAllSkills(true); }}>
                <Chip tone="count">+{profile.skills.length - 2}</Chip>
              </button>
            ) : null}
          </div>
          <p>
            <strong>{t.interest}</strong>
            <span>{interests || t.openCollaboration}</span>
          </p>
          <p>
            <strong>{t.experienceTitle}</strong>
            <span>{experienceLine}</span>
          </p>
        </div>

        {!isPreview ? (
          <button
            type="button"
            className="more-info-button"
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((current) => !current);
            }}
          >
            {expanded ? t.lessInfo : t.moreInfo}
          </button>
        ) : null}

        {!isPreview && expanded ? (
          <div className="candidate-expanded-info card-expanded-content">
            <p className="candidate-summary-desc">{localizeProfileSummary(profile, t)}</p>

            <div className="candidate-section-group">
              <h3>{t.topSkills}</h3>
              <div className="chip-row">
                {profile.skills.slice(0, 5).map((skillItem) => (
                  <Chip key={skillItem.name}>{skillItem.name}</Chip>
                ))}
              </div>
            </div>

            {profile.experienceSummary || (profile.experiences && profile.experiences[0]) ? (
              <div className="candidate-section-group">
                <h3>{t.experienceTitle}</h3>
                <div className="experience-preview-box">
                  <p>{localizeExperienceSummary(profile, t) || localizeExperienceText(profile.experiences[0]?.description || "", t)}</p>
                </div>
              </div>
            ) : null}

            <div className="looking-for-row">
              <Search size={16} aria-hidden="true" />
              <span>{t.lookingForPrefix} {profile.lookingFor.map((role) => localizeRoleLabel(role, t)).join(", ") || t.collaborators}</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Action Bar inside Card */}
      {!isPreview && (onPass || onSave || onInterest) ? (
        <div
          className="card-action-bar"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="card-btn card-btn-pass"
            title={t.passProfile}
            onClick={(e) => {
              e.stopPropagation();
              onPass?.();
            }}
          >
            <X size={24} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="card-btn card-btn-bookmark"
            title={t.saveProfile}
            onClick={(e) => {
              e.stopPropagation();
              onSave?.();
            }}
          >
            <Bookmark size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="card-btn card-btn-check"
            title={t.showInterest}
            onClick={(e) => {
              e.stopPropagation();
              onInterest?.();
            }}
          >
            <Check size={24} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </article>
  );
}

function CandidateDetailSheet({
  profile,
  onClose
}: {
  profile: CandidateProfile;
  onClose: () => void;
}) {
  const t = useTranslations();
  const groupedSkills = groupSkills(profile.skills);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="overlay detail-overlay" role="presentation" onClick={onClose}>
      <aside
        className="detail-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`${profile.name} profile details`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-header">
          <div className="saved-card-top">
            <Avatar profile={profile} size="md" />
            <div>
              <h2>{profile.name}</h2>
              <p>{localizeRoleLabel(profile.role, t)} · {profile.mainSkill}</p>
            </div>
          </div>
          <Button variant="circle" aria-label={t.close} onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </Button>
        </div>

        <div className="detail-content">
          <DetailSection title={t.fullSummary}>
            <p>{localizeProfileSummary(profile, t)}</p>
            <p>{localizeExperienceSummary(profile, t)}</p>
          </DetailSection>

          <DetailSection title={t.skillsByCategory}>
            {Object.entries(groupedSkills).map(([category, items]) => (
              <div className="skill-group" key={category}>
                <strong>{localizeSkillCategory(category, t)}</strong>
                <div className="chip-row">
                  {items.map((skillItem) => (
                    <Chip key={`${category}-${skillItem.name}`} tone="soft">
                      {skillItem.name} · {localizeSkillLevel(skillItem.level, t)}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </DetailSection>

          <DetailSection title={t.experienceTimeline}>
            {profile.experiences.length ? (
              <div className="timeline">
                {profile.experiences.map((experience) => (
                  <article className="timeline-item" key={experience.id}>
                    <span>{localizeTimeLabel(experience.period || t.recent, t)}</span>
                    <h3>{localizeExperienceText(experience.title, t)}</h3>
                    <p className="timeline-org">{localizeExperienceText(experience.organization, t)}</p>
                    <p>{localizeExperienceText(experience.description, t)}</p>
                    <div className="chip-row">
                      {experience.relatedSkills.map((skillName) => (
                        <Chip key={skillName}>{skillName}</Chip>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted-text">{t.noExperienceProof}</p>
            )}
          </DetailSection>

          <DetailSection title={t.portfolioLinks}>
            {profile.portfolioLinks.filter((link) => link.url).length ? (
              <div className="portfolio-list">
                {profile.portfolioLinks
                  .filter((link) => link.url)
                  .map((link) => (
                    <a href={link.url} key={`${link.label}-${link.url}`} target="_blank" rel="noreferrer">
                      <LinkIcon size={17} aria-hidden="true" />
                      {link.label}
                    </a>
                  ))}
              </div>
            ) : (
              <p className="muted-text">{t.portfolioCanBeAdded}</p>
            )}
          </DetailSection>

          <DetailSection title={t.collaborationFit}>
            <div className="detail-facts">
              <p>
                <strong>{t.preferredRoleLabel}:</strong> {localizePreferredRole(profile, t)}
              </p>
              <p>
                <strong>{t.availabilityLabel}:</strong> {localizeAvailabilityDetail(profile, t)}
              </p>
              <p>
                <strong>{t.suggestedOpener}:</strong> {localizeMatchMessage(profile.suggestedMessage, t)}
              </p>
            </div>
            <div className="chip-row">
              {profile.collaborationGoals.map((goal) => (
                <Chip key={goal} tone="soft">
                  {localizeCollaborationGoal(goal, t)}
                </Chip>
              ))}
            </div>
          </DetailSection>
        </div>
      </aside>
    </div>,
    document.body
  );
}

function MatchModal({
  candidate,
  onClose,
  onContinue
}: {
  candidate: CandidateProfile;
  onClose: () => void;
  onContinue: () => void;
}) {
  const navigate = useNavigate();
  const t = useTranslations();
  const match = createMatchFor(candidate);

  return createPortal(
    <div className="overlay" role="presentation" onClick={onClose}>
      <section className="match-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <Button variant="circle" aria-label="Close match modal" className="modal-close" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </Button>
        <div className="match-avatars">
          <Avatar profile={starterProfile} size="lg" />
          <Heart size={28} aria-hidden="true" />
          <Avatar profile={candidate} size="lg" />
        </div>
        <p className="eyebrow">{t.matchEyebrow}</p>
        <h2>{t.matchTitlePrefix} {candidate.name} {t.matchTitleSuffix}</h2>
        <div className="match-reason">
          <strong>{t.whyMatchWorks}</strong>
          {localizeMatchSummary(match, candidate, t).map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <div className="modal-actions">
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              navigate(`/chat/${match.id}`);
            }}
          >
            <MessageCircle size={18} aria-hidden="true" />
            {t.sendMessageBtn}
          </Button>
          <Button variant="secondary" onClick={onContinue}>
            {t.keepSwiping}
          </Button>
        </div>
      </section>
    </div>,
    document.body
  );
}

function SignupSuggestionModal({
  candidate,
  onClose,
  onViewProfile
}: {
  candidate: CandidateProfile;
  onClose: () => void;
  onViewProfile: () => void;
}) {
  const match = createMatchFor(candidate);
  const t = useTranslations();

  return createPortal(
    <div className="overlay" role="presentation" onClick={onClose}>
      <section className="match-modal signup-suggestion-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <Button variant="circle" aria-label="Close suggestion modal" className="modal-close" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </Button>
        <div className="match-avatars">
          <Avatar profile={candidate} size="lg" />
        </div>
        <p className="eyebrow">{t.suggestionMatch}</p>
        <h2>{candidate.name} {t.suggestionTitleSuffix}</h2>
        <div className="match-reason">
          <strong>{t.whySuggested}</strong>
          {localizeMatchSummary(match, candidate, t).map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <div className="modal-actions">
          <Button variant="primary" onClick={onViewProfile}>
            <Eye size={18} aria-hidden="true" />
            {t.viewProfile}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {t.keepSwiping}
          </Button>
        </div>
      </section>
    </div>,
    document.body
  );
}

function FilterPanel({
  variant,
  onApplied
}: {
  variant: "desktop" | "mobile";
  onApplied?: () => void;
}) {
  const { filters, setFilters, clearFilters } = useSymbio();
  const t = useTranslations();
  const programs = uniquePrograms();
  const skills = uniqueSkills();

  const updateFilter = (key: keyof FilterValues, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className={`filter-panel ${variant}`}>
      <div className="rail-heading">
        <h2>{t.filters}</h2>
        <button className="text-link" onClick={clearFilters}>
          {t.clearAll}
        </button>
      </div>
      <SelectField
        label={t.skillCategory}
        value={filters.skillCategory}
        onChange={(value) => updateFilter("skillCategory", value)}
        options={[
          { label: t.anyCategory, value: "" },
          ...skillCategories.map((category) => ({ label: localizeSkillCategory(category, t), value: category }))
        ]}
      />
      <SelectField
        label={t.specificSkill}
        value={filters.specificSkill}
        onChange={(value) => updateFilter("specificSkill", value)}
        options={[
          { label: t.anySkill, value: "" },
          ...skills.map((skillName) => ({ label: skillName, value: skillName }))
        ]}
      />
      <SelectField
        label={t.role}
        value={filters.role}
        onChange={(value) => updateFilter("role", value)}
        options={[
          { label: t.anyRole, value: "" },
          ...roleOptions.map((role) => ({ label: localizeRoleLabel(role, t), value: role }))
        ]}
      />
      <SelectField
        label={t.availabilityLabel}
        value={filters.availability}
        onChange={(value) => updateFilter("availability", value)}
        options={[
          { label: t.anyAvailability, value: "" },
          { label: localizeAvailabilityLabel("available", t), value: "available" },
          { label: localizeAvailabilityLabel("limited", t), value: "limited" },
          { label: localizeAvailabilityLabel("busy", t), value: "busy" }
        ]}
      />
      <SelectField
        label={t.collaborationGoal}
        value={filters.collaborationGoal}
        onChange={(value) => updateFilter("collaborationGoal", value)}
        options={[
          { label: t.anyGoal, value: "" },
          ...collaborationGoalOptions.map((goal) => ({ label: localizeCollaborationGoal(goal, t), value: goal }))
        ]}
      />
      <SelectField
        label={t.program}
        value={filters.program}
        onChange={(value) => updateFilter("program", value)}
        options={[
          { label: t.anyProgram, value: "" },
          ...programs.map((program) => ({ label: program, value: program }))
        ]}
      />
      <SelectField
        label={t.experienceLevel}
        value={filters.level}
        onChange={(value) => updateFilter("level", value)}
        options={[
          { label: t.anyLevel, value: "" },
          { label: localizeSkillLevel("Beginner", t), value: "Beginner" },
          { label: localizeSkillLevel("Intermediate", t), value: "Intermediate" },
          { label: localizeSkillLevel("Advanced", t), value: "Advanced" },
          { label: localizeSkillLevel("Project-ready", t), value: "Project-ready" }
        ]}
      />
      {variant === "mobile" ? (
        <div className="filter-mobile-actions">
          <Button variant="secondary" onClick={clearFilters}>
            {t.reset}
          </Button>
          <Button variant="primary" onClick={onApplied}>
            {t.applyFilters}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function ActiveFilterChips() {
  const { filters, setFilters, clearFilters } = useSymbio();
  const t = useTranslations();
  const entries = Object.entries(filters).filter(([, value]) => value);

  if (!entries.length) {
    return null;
  }

  return (
    <div className="active-filter-row" aria-label="Active filters">
      {entries.map(([key, value]) => (
        <button
          key={key}
          onClick={() => setFilters((current) => ({ ...current, [key]: "" }))}
        >
          {localizeFilterValue(key, value, t)}
          <X size={14} aria-hidden="true" />
        </button>
      ))}
      <button onClick={clearFilters}>{t.clearAll}</button>
    </div>
  );
}

function ClearFiltersButton() {
  const { clearFilters } = useSymbio();
  const t = useTranslations();
  return (
    <Button variant="primary" onClick={clearFilters}>
      {t.clearAll}
    </Button>
  );
}

function PageHeader({
  eyebrow,
  title,
  action
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {action ? <div className="page-action">{action}</div> : null}
    </header>
  );
}

function EmptyState({
  title,
  body,
  action
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <section className="empty-state">
      <div className="empty-icon">
        <SlidersHorizontal size={28} aria-hidden="true" />
      </div>
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </section>
  );
}

function Button({
  children,
  className = "",
  variant = "secondary",
  ...props
}: {
  children: ReactNode;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "ghostDanger"
    | "circle"
    | "circlePrimary"
    | "circleDanger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

function getSkillCategory(name: string): string {
  const normalized = name.toLowerCase().trim();
  const found = allSkills.find((s) => s.name.toLowerCase().trim() === normalized);
  if (found) return found.category;
  
  if (["react", "node.js", "typescript", "python", "mysql", "laravel", "javascript", "html", "css", "docker", "git", "api"].some(k => normalized.includes(k))) {
    return "Development";
  }
  if (["figma", "wireframe", "prototype", "ui", "ux", "design"].some(k => normalized.includes(k))) {
    return "Design";
  }
  if (["business", "pitch", "marketing", "strategy", "agile", "finance", "management"].some(k => normalized.includes(k))) {
    return "Business";
  }
  return "Development";
}

function Chip({ children, tone = "default", category }: { children: ReactNode; tone?: "default" | "soft" | "count"; category?: string }) {
  let catClass = "";
  if (category) {
    catClass = ` chip-cat-${category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  } else if (typeof children === "string") {
    const cat = getSkillCategory(children);
    catClass = ` chip-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  }
  return <span className={`chip chip-${tone}${catClass}`}>{children}</span>;
}

function AvailabilityBadge({
  availability,
  label
}: {
  availability: CandidateProfile["availability"];
  label?: string;
}) {
  const t = useTranslations();
  const fallback = localizeAvailabilityLabel(availability, t);
  return <span className={`availability availability-${availability}`}>{localizeStatusLabel(label, t) || fallback}</span>;
}

function Avatar({ profile, size }: { profile: CandidateProfile; size: "xs" | "sm" | "md" | "lg" }) {
  if (profile.avatarUrl) {
    return (
      <img
        src={profile.avatarUrl}
        alt={profile.name}
        className={`avatar avatar-${size}`}
        style={{ objectPosition: profile.avatarPosition || "center" }}
        draggable={false}
      />
    );
  }
  return (
    <span
      className={`avatar avatar-${size}`}
      style={{ "--accent": "var(--primary)" } as CSSProperties}
      aria-hidden="true"
    >
      {getInitials(profile.name)}
    </span>
  );
}

function StepProgress({ steps, activeStep }: { steps: string[]; activeStep: number }) {
  return (
    <div className="step-progress" aria-label="Onboarding progress">
      {steps.map((item, index) => (
        <span
          key={item}
          className={index === activeStep ? "active" : index < activeStep ? "done" : ""}
          aria-current={index === activeStep ? "step" : undefined}
        />
      ))}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="form-section">
      <h2>{title}</h2>
      <div className="field-grid">{children}</div>
    </section>
  );
}

function PhotoUploadField({
  label,
  value,
  position,
  onChange,
  onPositionChange
}: {
  label: string;
  value: string;
  position: string;
  onChange: (value: string) => void;
  onPositionChange: (value: string) => void;
}) {
  const t = useTranslations();
  const [x, y] = position.split(" ");

  let xNum = 50;
  if (x) {
    if (x === "center") {
      xNum = 50;
    } else {
      const parsed = Number.parseInt(x, 10);
      xNum = Number.isNaN(parsed) ? 50 : parsed;
    }
  }

  let yNum = 50;
  if (y) {
    if (y === "center") {
      yNum = 50;
    } else {
      const parsed = Number.parseInt(y, 10);
      yNum = Number.isNaN(parsed) ? 42 : parsed;
    }
  }

  const updatePosition = (nextX = xNum, nextY = yNum) => {
    onPositionChange(`${nextX}% ${nextY}%`);
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="photo-upload-field">
      <span>{label}</span>
      <div className="photo-preview-frame">
        {value ? (
          <img src={value} alt={`${label} preview`} style={{ objectPosition: position }} />
        ) : (
          <div className="photo-preview-empty">
            <User size={28} aria-hidden="true" />
            <small>{t.noPhoto}</small>
          </div>
        )}
      </div>
      <div className="photo-upload-actions">
        <label className="button button-secondary">
          {t.upload}
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t.pastePhotoUrl}
        />
      </div>
      <div className="crop-control-grid">
        <label>
          <span>{t.horizontalCrop} <small>{xNum}%</small></span>
          <input
            type="range"
            min="0"
            max="100"
            value={xNum}
            onChange={(event) => updatePosition(Number(event.target.value), yNum)}
          />
        </label>
        <label>
          <span>{t.verticalCrop} <small>{yNum}%</small></span>
          <input
            type="range"
            min="0"
            max="100"
            value={yNum}
            onChange={(event) => updatePosition(xNum, Number(event.target.value))}
          />
        </label>
        <button type="button" className="crop-reset-button" onClick={() => updatePosition(50, 42)}>
          {t.centerCrop}
        </button>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
  minRows = 4,
  maxLength,
  hint
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        value={value}
        rows={minRows}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MultiChipField({
  label,
  values,
  options,
  onChange
}: {
  label: string;
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
}) {
  const t = useTranslations();
  const [customValue, setCustomValue] = useState("");
  const toggle = (value: string) => {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const addCustom = () => {
    const cleanValue = customValue.trim();
    if (!cleanValue) {
      return;
    }
    onChange(values.includes(cleanValue) ? values : [...values, cleanValue]);
    setCustomValue("");
  };

  return (
    <fieldset className="multi-field">
      <legend>{label}</legend>
      <div className="toggle-grid">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={values.includes(option) ? "selected" : ""}
            onClick={() => toggle(option)}
          >
            {localizeOptionLabel(option, t)}
          </button>
        ))}
      </div>
      <div className="custom-chip-input">
        <input
          value={customValue}
          onChange={(event) => setCustomValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCustom();
            }
          }}
          placeholder={`${t.addCustom} ${label.toLowerCase()}`}
        />
        <Button type="button" variant="secondary" onClick={addCustom}>
          {t.add}
        </Button>
      </div>
    </fieldset>
  );
}

function SkillChecklist({
  selected,
  onChange,
  helper
}: {
  selected: Skill[];
  onChange: (skills: Skill[]) => void;
  helper?: string;
}) {
  const t = useTranslations();
  const selectedNames = selected.map((skillItem) => skillItem.name);
  const grouped = groupSkills(allSkills);
  const [customSkill, setCustomSkill] = useState("");

  const toggle = (skillItem: Skill) => {
    onChange(
      selectedNames.includes(skillItem.name)
        ? selected.filter((item) => item.name !== skillItem.name)
        : [...selected, skillItem]
    );
  };

  const addCustomSkill = () => {
    const cleanSkill = customSkill.trim();
    if (!cleanSkill) {
      return;
    }
    const customItem: Skill = {
      name: cleanSkill,
      category: getSkillCategory(cleanSkill),
      level: "Intermediate"
    };
    onChange(selectedNames.includes(cleanSkill) ? selected : [...selected, customItem]);
    setCustomSkill("");
  };

  return (
    <div className="skill-picker">
      <div className="field-label">
        <span>{t.additionalSkills}</span>
        {helper ? <small>{helper}</small> : null}
      </div>
      {Object.entries(grouped).map(([category, skills]) => (
        <div className="skill-picker-group" key={category}>
          <strong>{localizeSkillCategory(category, t)}</strong>
          <div className="toggle-grid">
            {skills.map((skillItem) => (
              <button
                type="button"
                key={skillItem.name}
                className={selectedNames.includes(skillItem.name) ? "selected" : ""}
                onClick={() => toggle(skillItem)}
              >
                {skillItem.name}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="custom-chip-input">
        <input
          value={customSkill}
          onChange={(event) => setCustomSkill(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCustomSkill();
            }
          }}
          placeholder={t.addSkill}
        />
        <Button type="button" variant="secondary" onClick={addCustomSkill}>
          {t.addSkill}
        </Button>
      </div>
    </div>
  );
}

function ExperienceEditor({
  experience,
  onChange
}: {
  experience: Experience;
  onChange: (experience: Experience) => void;
}) {
  const t = useTranslations();
  const update = (patch: Partial<Experience>) => onChange({ ...experience, ...patch });

  return (
    <div className="field-grid">
      <TextField
        label={t.titleRole}
        value={experience.title}
        onChange={(title) => update({ title })}
        placeholder="Frontend Developer"
      />
      <TextField
        label={t.projectOrganization}
        value={experience.organization}
        onChange={(organization) => update({ organization })}
        placeholder="Tel-U Lost and Found"
      />
      <TextField
        label={t.period}
        value={experience.period ?? ""}
        onChange={(period) => update({ period })}
        placeholder="2026"
      />
      <TextAreaField
        label={t.description}
        value={experience.description}
        onChange={(description) => update({ description })}
        minRows={4}
        placeholder={t.experienceSummaryPlaceholder}
      />
      <MultiChipField
        label={t.relatedSkills}
        values={experience.relatedSkills}
        options={uniqueSkills()}
        onChange={(relatedSkills) => update({ relatedSkills })}
      />
    </div>
  );
}

function PortfolioEditor({
  links,
  onChange
}: {
  links: PortfolioLink[];
  onChange: (links: PortfolioLink[]) => void;
}) {
  const t = useTranslations();
  const normalized = links.length
    ? links
    : [
        { label: "GitHub", url: "" },
        { label: "Figma", url: "" },
        { label: "Portfolio", url: "" }
      ];

  const update = (index: number, patch: Partial<PortfolioLink>) => {
    onChange(normalized.map((link, linkIndex) => (linkIndex === index ? { ...link, ...patch } : link)));
  };

  return (
    <div className="field-grid">
      {normalized.map((link, index) => {
        const hasWarning = link.url && !isUrlLike(link.url);
        return (
          <div className="portfolio-field" key={`${link.label}-${index}`}>
            <TextField
              label={t.labelField}
              value={link.label}
              onChange={(label) => update(index, { label })}
              placeholder="GitHub"
            />
            <TextField
              label={t.urlField}
              value={link.url}
              onChange={(url) => update(index, { url })}
              placeholder="https://example.com"
            />
            {hasWarning ? <small className="warning-text">{t.urlWarning}</small> : null}
          </div>
        );
      })}
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="detail-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function ToastStack() {
  const { toasts } = useSymbio();

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div className="toast" key={toast.id}>
          <strong>{toast.title}</strong>
          <p>{toast.body}</p>
        </div>
      ))}
    </div>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}

function isIndonesian(t: TranslationSet) {
  return t.discover === translations.id.discover;
}

function localizeStatusLabel(label: string | undefined, t: TranslationSet) {
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

function localizeAvailabilityLabel(availability: CandidateProfile["availability"], t: TranslationSet) {
  if (availability === "available") {
    return isIndonesian(t) ? "Tersedia" : "Available";
  }
  if (availability === "limited") {
    return isIndonesian(t) ? "Terbatas" : "Limited";
  }
  return isIndonesian(t) ? "Sibuk" : "Busy";
}

function localizeNotification(notification: NotificationItem, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return {
      ...notification,
      type: notification.type === "match" ? "Match" : notification.type === "message" ? "Message" : "Project"
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

  const type = notification.type === "match" ? "Kecocokan" : notification.type === "message" ? "Pesan" : "Proyek";
  return { ...notification, type, ...(known[notification.id] ?? {}) };
}

function localizeProject(project: typeof mockProjects[number], t: TranslationSet) {
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

function localizeRoleLabel(role: string, t: TranslationSet) {
  if (!isIndonesian(t)) {
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

function localizeCollaborationGoal(goal: string, t: TranslationSet) {
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

function localizeSkillCategory(category: string, t: TranslationSet) {
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

function localizeSkillLevel(level: string, t: TranslationSet) {
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

function localizeOptionLabel(value: string, t: TranslationSet) {
  if (roleOptions.includes(value)) {
    return localizeRoleLabel(value, t);
  }
  if (collaborationGoalOptions.includes(value)) {
    return localizeCollaborationGoal(value, t);
  }
  if (skillCategories.includes(value)) {
    return localizeSkillCategory(value, t);
  }
  return value;
}

function localizeFilterValue(key: string, value: string, t: TranslationSet) {
  if (key === "availability") {
    return localizeAvailabilityLabel(value as CandidateProfile["availability"], t);
  }
  if (key === "level") {
    return localizeSkillLevel(value, t);
  }
  return localizeOptionLabel(value, t);
}

function localizeActionHint(actionHint: string | undefined, t: TranslationSet) {
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
  return actionHint;
}

function localizeMatchMessage(message: string, t: TranslationSet) {
  if (!isIndonesian(t)) {
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

function localizeChatMessage(message: string, t: TranslationSet) {
  return localizeMatchMessage(message, t);
}

function localizeTimeLabel(time: string, t: TranslationSet) {
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

function localizeMatchSummary(match: MatchRecord, candidate: CandidateProfile, t: TranslationSet) {
  if (!isIndonesian(t)) {
    return match.summary;
  }

  const firstName = candidate.name.split(" ")[0];
  const firstSkill = candidate.skills[0]?.name ?? candidate.mainSkill;
  const secondSkill = candidate.skills[1]?.name;
  const skillText = secondSkill ? `${firstSkill} dan ${secondSkill}` : firstSkill;
  const goal = candidate.collaborationGoals[0]
    ? localizeCollaborationGoal(candidate.collaborationGoals[0], t).toLowerCase()
    : "proyek";

  return [
    `Anda mencari dukungan ${localizeRoleLabel(candidate.role, t).toLowerCase()}.`,
    `${firstName} punya pengalaman ${skillText}.`,
    `Kedua profil menyebut kolaborasi ${goal}.`
  ];
}

function localizeProfileSummary(profile: CandidateProfile, t: TranslationSet) {
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

function localizeExperienceSummary(profile: CandidateProfile, t: TranslationSet) {
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

function localizeAvailabilityDetail(profile: CandidateProfile, t: TranslationSet) {
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

function localizePreferredRole(profile: CandidateProfile, t: TranslationSet) {
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

function localizeExperienceText(text: string, t: TranslationSet) {
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
    "IoT Prototype Builder": "Pembuat Prototipe IoT",
    "Smart Locker Assignment": "Tugas Smart Locker",
    "Connected RFID, sensors, and a dashboard proof of concept for secure locker access.":
      "Menghubungkan RFID, sensor, dan proof of concept dashboard untuk akses locker yang aman."
  };

  return texts[text] ?? text;
}

function findBestSuggestion(suggestion: { mainSkill?: string; skills?: string[]; role?: string }) {
  const normalizedSkills = new Set(
    [suggestion.mainSkill, ...(suggestion.skills ?? [])]
      .filter(Boolean)
      .map((skill) => String(skill).toLowerCase())
  );
  const role = suggestion.role?.toLowerCase() ?? "";

  const ranked = candidates
    .map((candidate) => {
      const skillScore = candidate.skills.reduce(
        (score, skillItem) => score + (normalizedSkills.has(skillItem.name.toLowerCase()) ? 3 : 0),
        0
      );
      const mainSkillScore = normalizedSkills.has(candidate.mainSkill.toLowerCase()) ? 5 : 0;
      const roleScore = role && candidate.role.toLowerCase().includes(role) ? 2 : 0;
      return { candidate, score: skillScore + mainSkillScore + roleScore };
    })
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.candidate ?? candidates[0] ?? null;
}

function findCandidatesForQuery(query: string) {
  const normalized = query.toLowerCase();
  const tokens = normalized.split(/[^a-z0-9+#.]+/).filter(Boolean);

  return candidates
    .map((candidate) => {
      let score = 0;
      const role = candidate.role.toLowerCase();
      const mainSkill = candidate.mainSkill.toLowerCase();
      const summary = candidate.profileSummary.toLowerCase();

      if (normalized.includes(mainSkill)) {
        score += 8;
      }
      if (normalized.includes(role)) {
        score += 5;
      }

      candidate.skills.forEach((skillItem) => {
        const skillName = skillItem.name.toLowerCase();
        if (normalized.includes(skillName)) {
          score += candidate.mainSkill === skillItem.name ? 7 : 4;
        }
      });

      candidate.collaborationGoals.forEach((goal) => {
        if (normalized.includes(goal.toLowerCase())) {
          score += 2;
        }
      });

      tokens.forEach((token) => {
        if (role.includes(token) || mainSkill.includes(token) || summary.includes(token)) {
          score += 1;
        }
      });

      return { candidate, score };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((item) => item.candidate);
}

function applyFilters(profiles: CandidateProfile[], filters: FilterValues) {
  return profiles.filter((profile) => {
    const matchesCategory =
      !filters.skillCategory ||
      profile.skills.some((skillItem) => skillItem.category === filters.skillCategory);
    const matchesSkill =
      !filters.specificSkill ||
      profile.mainSkill === filters.specificSkill ||
      profile.skills.some((skillItem) => skillItem.name === filters.specificSkill);
    const matchesRole = !filters.role || profile.role === filters.role;
    const matchesAvailability = !filters.availability || profile.availability === filters.availability;
    const matchesGoal =
      !filters.collaborationGoal || profile.collaborationGoals.includes(filters.collaborationGoal);
    const matchesProgram = !filters.program || profile.program === filters.program;
    const matchesLevel =
      !filters.level || profile.skills.some((skillItem) => skillItem.level === filters.level);

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

function groupSkills(skills: Skill[]) {
  return skills.reduce<Record<string, Skill[]>>((groups, skillItem) => {
    if (!groups[skillItem.category]) {
      groups[skillItem.category] = [];
    }
    groups[skillItem.category].push(skillItem);
    return groups;
  }, {});
}

function uniqueSkills() {
  return Array.from(
    new Set([...allSkills.map((skillItem) => skillItem.name), ...candidates.flatMap((candidate) => candidate.skills.map((skillItem) => skillItem.name))])
  ).sort();
}

function uniquePrograms() {
  return Array.from(new Set(candidates.map((candidate) => candidate.program))).sort();
}

function ensureSkillSelected(skills: Skill[], skillName: string) {
  if (!skillName || skills.some((skillItem) => skillItem.name === skillName)) {
    return skills;
  }
  const known = allSkills.find((skillItem) => skillItem.name === skillName);
  return known ? [known, ...skills] : skills;
}

function validateOnboardingStep(step: number, draft: CandidateProfile, t: TranslationSet) {
  const errors: string[] = [];

  if (step === 0 && !draft.name.trim()) {
    errors.push(t.fullNameRequiredValidation);
  }
  if (step === 1) {
    if (!draft.campus.trim()) {
      errors.push(t.campusRequired);
    }
    if (!draft.program.trim()) {
      errors.push(t.programRequired);
    }
  }
  if (step === 2) {
    if (!draft.role) {
      errors.push(t.mainRoleRequired);
    }
    if (!draft.mainSkill) {
      errors.push(t.mainSkillRequired);
    }
    if (!draft.collaborationGoals.length) {
      errors.push(t.collaborationTypeRequired);
    }
  }
  if (step === 3 && draft.skills.length < 3) {
    errors.push(t.skillRequired);
  }
  if (step === 4) {
    if (draft.profileSummary.length > 180) {
      errors.push(t.profileSummaryLimit);
    }
  }
  if (step === 5 && draft.experienceSummary.length > 240) {
    errors.push(t.experienceSummaryLimit);
  }
  if (step === 6) {
    const experience = draft.experiences[0];
    if (!experience?.title.trim()) {
      errors.push(t.experienceTitleRequired);
    }
    if (!experience?.organization.trim()) {
      errors.push(t.projectRequired);
    }
    if (!experience?.description.trim()) {
      errors.push(t.experienceDescriptionRequired);
    }
  }
  if (step === 7) {
    const badLink = draft.portfolioLinks.find((link) => link.url && !isUrlLike(link.url));
    if (badLink) {
      errors.push(`${badLink.label || "Portfolio"} ${t.portfolioUrlInvalid}`);
    }
  }
  if (step === 8 && !draft.availability) {
    errors.push(t.availabilityRequired);
  }
  if (step === 9 && !draft.lookingFor.length) {
    errors.push(t.lookingForRequired);
  }

  return errors;
}

function validateProfile(profile: CandidateProfile) {
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

function getCandidate(candidateId: string) {
  return candidateLookup.get(candidateId);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getActionHint(x: number, y: number) {
  const horizontal = Math.abs(x);
  const vertical = Math.abs(y);

  if (horizontal < 50 && vertical < 50) {
    return "";
  }
  if (vertical > horizontal && y < -50) {
    return "Save";
  }
  if (horizontal > vertical && x > 50) {
    return "Interested";
  }
  if (horizontal > vertical && x < -50) {
    return "Pass";
  }
  return "";
}

function isUrlLike(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}


function TermsPage() {
  const t = useTranslations();
  const id = isIndonesian(t);

  return (
    <div className="legal-page page-transition">
      <Link to="/" className="legal-back-link">
        <ArrowLeft size={16} /> {t.home}
      </Link>
      <h1>{id ? "Syarat dan Ketentuan" : "Terms of Service"}</h1>
      <p>{id ? "Terakhir diperbarui: Juni 2025" : "Last updated: June 2025"}</p>

      <h2>{id ? "1. Penerimaan Syarat" : "1. Acceptance of Terms"}</h2>
      <p>{id ? "Dengan mengakses atau menggunakan Mutualizm, Anda setuju untuk terikat dengan syarat ini. Jika tidak setuju, mohon jangan gunakan platform." : 'By accessing or using Mutualizm ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.'}</p>

      <h2>{id ? "2. Deskripsi Layanan" : "2. Description of Service"}</h2>
      <p>{id ? "Mutualizm adalah platform kolaborasi kampus yang menghubungkan mahasiswa, pengembang, desainer, dan strategis bisnis untuk kerja tim berbasis proyek." : "Mutualizm is a campus collaboration platform that connects students, developers, designers, and business strategists for project-based teamwork."}</p>

      <h2>{id ? "3. Akun Pengguna" : "3. User Accounts"}</h2>
      <p>{id ? "Anda harus memberikan informasi yang akurat dan lengkap saat membuat akun. Anda bertanggung jawab menjaga kerahasiaan kredensial masuk." : "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials."}</p>

      <h2>{id ? "4. Penggunaan yang Diperbolehkan" : "4. Acceptable Use"}</h2>
      <ul>
        <li>{id ? "Anda setuju tidak menggunakan platform untuk tujuan yang melanggar hukum atau merugikan." : "You agree not to use the Platform for any unlawful or harmful purposes."}</li>
        <li>{id ? "Anda tidak akan mengunggah konten yang menyesatkan, kasar, atau menyerang." : "You will not post misleading, abusive, or offensive content."}</li>
        <li>{id ? "Anda akan menghormati kekayaan intelektual pengguna lain." : "You will respect the intellectual property of other users."}</li>
      </ul>

      <h2>{id ? "5. Kekayaan Intelektual" : "5. Intellectual Property"}</h2>
      <p>{id ? "Semua konten yang Anda buat dan bagikan tetap menjadi milik Anda. Dengan memposting konten, Anda memberi Mutualizm lisensi non-eksklusif untuk menampilkannya di dalam platform." : "All content you create and share on the Platform remains your property. By posting content, you grant Mutualizm a non-exclusive license to display it within the Platform."}</p>

      <h2>{id ? "6. Batasan Tanggung Jawab" : "6. Limitation of Liability"}</h2>
      <p>{id ? "Mutualizm disediakan apa adanya tanpa jaminan apa pun. Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan platform." : 'Mutualizm is provided "as is" without warranties of any kind. We are not liable for any damages resulting from your use of the Platform.'}</p>

      <h2>{id ? "7. Kontak" : "7. Contact"}</h2>
      <p>{id ? "Untuk pertanyaan tentang syarat ini, hubungi support@mutualizm.id." : "For questions about these Terms, contact us at support@mutualizm.id."}</p>
    </div>
  );
}

function PrivacyPage() {
  const t = useTranslations();
  const id = isIndonesian(t);

  return (
    <div className="legal-page page-transition">
      <Link to="/" className="legal-back-link">
        <ArrowLeft size={16} /> {t.home}
      </Link>
      <h1>{id ? "Kebijakan Privasi" : "Privacy Policy"}</h1>
      <p>{id ? "Terakhir diperbarui: Juni 2025" : "Last updated: June 2025"}</p>

      <h2>{id ? "1. Informasi yang Kami Kumpulkan" : "1. Information We Collect"}</h2>
      <p>{id ? "Kami mengumpulkan informasi yang Anda berikan saat membuat akun, termasuk nama, email, keahlian, dan detail profil." : "We collect the information you provide when creating an account, including your name, email, skills, and profile details."}</p>

      <h2>{id ? "2. Cara Kami Menggunakan Informasi" : "2. How We Use Your Information"}</h2>
      <ul>
        <li>{id ? "Untuk menyediakan dan meningkatkan pengalaman platform." : "To provide and improve the Platform experience."}</li>
        <li>{id ? "Untuk mencocokkan Anda dengan kolaborator dan proyek yang relevan." : "To match you with relevant collaborators and projects."}</li>
        <li>{id ? "Untuk mengirim notifikasi terkait aktivitas Anda." : "To send notifications related to your activity."}</li>
      </ul>

      <h2>{id ? "3. Pembagian Data" : "3. Data Sharing"}</h2>
      <p>{id ? "Kami tidak menjual data pribadi Anda. Informasi profil Anda terlihat oleh pengguna platform lain sebagai bagian dari proses pencocokan kolaborasi." : "We do not sell your personal data. Your profile information is visible to other Platform users as part of the collaboration matching process."}</p>

      <h2>{id ? "4. Keamanan Data" : "4. Data Security"}</h2>
      <p>{id ? "Kami menerapkan langkah keamanan standar industri untuk melindungi data Anda. Namun, tidak ada metode transmisi melalui internet yang sepenuhnya aman." : "We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure."}</p>

      <h2>{id ? "5. Hak Anda" : "5. Your Rights"}</h2>
      <ul>
        <li>{id ? "Anda dapat mengakses, memperbarui, atau menghapus data pribadi kapan saja melalui pengaturan profil." : "You may access, update, or delete your personal data at any time through your profile settings."}</li>
        <li>{id ? "Anda dapat meminta salinan data dengan menghubungi kami." : "You may request a copy of your data by contacting us."}</li>
      </ul>

      <h2>{id ? "6. Kontak" : "6. Contact"}</h2>
      <p>{id ? "Untuk pertanyaan privasi, hubungi privacy@mutualizm.id." : "For privacy concerns, contact us at privacy@mutualizm.id."}</p>
    </div>
  );
}

export default App;
