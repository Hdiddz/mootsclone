import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type PointerEventHandler,
    type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Bell,
    Briefcase,
    Check,
    ChevronLeft,
    ChevronRight,
    FlaskConical,
    GraduationCap,
    Heart,
    Menu,
    MessageCircle,
    Moon,
    Rocket,
    Search,
    Settings,
    Sun,
    Users,
    X,
} from "lucide-react";
import { useSymbio, useTranslations } from "../App";
import "../landing.css";

/* ------------------------------------------------------------------ */
/* Shared hooks                                                        */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(media.matches);
        const onChange = () => setReduced(media.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    return reduced;
}

/** Adds `.is-in` once the element scrolls into view (one-shot). */
function Reveal({
    children,
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`lp-reveal ${inView ? "is-in" : ""} ${className}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Hero card deck                                                      */
/* ------------------------------------------------------------------ */

const heroDeckCards = [
    {
        name: "Aditya Pratama",
        role: "UI/UX Designer",
        summary:
            "Mencari developer untuk membuat prototype aplikasi belajar kelompok interaktif.",
        skills: ["UI/UX", "Figma", "Prototyping"],
        avatarUrl: "/foto-1.jpg",
    },
    {
        name: "Farhan Hakim",
        role: "Backend Developer",
        summary:
            "Fokus pada Laravel dan REST API. Ingin berkolaborasi dalam proyek web e-learning.",
        skills: ["Laravel", "MySQL", "API Development"],
        avatarUrl: "/foto-2.jpg",
    },
    {
        name: "Rian Hidayat",
        role: "Mobile Developer",
        summary:
            "Flutter developer yang tertarik dengan aplikasi produktivitas mahasiswa.",
        skills: ["Flutter", "Dart", "Firebase"],
        avatarUrl: "/foto-3.jpg",
    },
    {
        name: "Pradipta Muhtadin",
        role: "Front-End Developer",
        summary:
            "Senang membangun antarmuka web yang interaktif dan responsif menggunakan React.",
        skills: ["React", "CSS Grid", "JavaScript"],
        avatarUrl: "/foto-4.jpg",
    },
    {
        name: "Dian Saputra",
        role: "Machine Learning Engineer",
        summary:
            "Tertarik pada riset AI untuk analisis sentimen media sosial. Butuh partner frontend.",
        skills: ["Python", "TensorFlow", "Scikit-Learn"],
        avatarUrl: "/foto-5.jpg",
    },
    {
        name: "Zacky Ahmad",
        role: "Project Manager",
        summary:
            "Terbiasa mengelola timeline proyek kuliah dan metodologi Scrum. Siap memimpin tim.",
        skills: ["Agile", "Scrum", "Trello"],
        avatarUrl: "/foto-6.jpg",
    },
];

const AUTOPLAY_MS = 4600;
const DRAG_THRESHOLD = 70;

/**
 * Stacked card deck. Every card stays mounted and only moves between
 * transform "slots" (active / next / third / out / hidden), so movement is a
 * single continuous CSS transition instead of a timer-driven swap — this is
 * what removes the stutter of the old carousel.
 */
function HeroCardDeck() {
    const total = heroDeckCards.length;
    const [index, setIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const pointerStart = useRef<{ x: number; y: number } | null>(null);
    const pausedRef = useRef(false);
    const wheelLocked = useRef(false);
    const reducedMotion = usePrefersReducedMotion();

    const advance = useCallback(
        (direction: "next" | "prev") => {
            setIndex((prev) =>
                direction === "next"
                    ? (prev + 1) % total
                    : (prev - 1 + total) % total,
            );
            setDragX(0);
        },
        [total],
    );

    // Auto-advance keeps running under prefers-reduced-motion too: in that
    // mode the CSS swaps cards with an opacity-only crossfade (no movement).
    useEffect(() => {
        const timer = window.setInterval(() => {
            if (pausedRef.current || document.hidden) return;
            setIndex((prev) => (prev + 1) % total);
            setDragX(0);
        }, AUTOPLAY_MS);
        return () => window.clearInterval(timer);
    }, [total]);

    const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
        pointerStart.current = { x: e.clientX, y: e.clientY };
        pausedRef.current = true;
        setDragging(true);
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
        if (!pointerStart.current) return;
        setDragX(e.clientX - pointerStart.current.x);
    };

    const endDrag = () => {
        if (!pointerStart.current) return;
        const delta = dragX;
        pointerStart.current = null;
        setDragging(false);
        if (Math.abs(delta) > DRAG_THRESHOLD) {
            advance(delta < 0 ? "next" : "prev");
        } else {
            setDragX(0);
        }
        window.setTimeout(() => {
            pausedRef.current = false;
        }, 800);
    };

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        if (Math.abs(event.deltaX) < 24 || wheelLocked.current) return;
        wheelLocked.current = true;
        advance(event.deltaX > 0 ? "next" : "prev");
        window.setTimeout(() => {
            wheelLocked.current = false;
        }, 600);
    };

    const slotFor = (cardIndex: number) => {
        const rel = (cardIndex - index + total) % total;
        if (rel === 0) return "is-active";
        if (rel === 1) return "is-next";
        if (rel === 2) return "is-third";
        if (rel === total - 1) return "is-out";
        return "is-hidden";
    };

    return (
        <div
            className={`lp-deck-wrap ${reducedMotion ? "lp-reduced" : ""}`}
            aria-label="Moots candidate preview"
        >
            <div className="lp-deck-glow" aria-hidden="true" />
            <div
                className="lp-deck"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={endDrag}
                onWheel={handleWheel}
                onMouseEnter={() => {
                    pausedRef.current = true;
                }}
                onMouseLeave={() => {
                    pausedRef.current = false;
                }}
            >
                {heroDeckCards.map((card, i) => {
                    const slot = slotFor(i);
                    const isActive = slot === "is-active";
                    const style =
                        isActive && dragX !== 0
                            ? {
                                  transform: `translateX(${dragX}px) rotate(${Math.max(-9, Math.min(9, dragX / 22))}deg)`,
                              }
                            : undefined;
                    return (
                        <article
                            key={card.name}
                            className={`lp-deck-card ${slot} ${
                                isActive && dragging ? "is-dragging" : ""
                            }`}
                            style={style}
                            aria-hidden={!isActive}
                        >
                            <img
                                src={card.avatarUrl}
                                alt={card.name}
                                draggable={false}
                                loading={i > 1 ? "lazy" : undefined}
                            />
                            <div className="lp-deck-overlay">
                                <div className="lp-deck-topline">
                                    <div>
                                        <h3>{card.name}</h3>
                                        <p>{card.role}</p>
                                    </div>
                                    <span className="lp-status-pill">
                                        <span aria-hidden="true" />
                                        Available
                                    </span>
                                </div>
                                <small>{card.summary}</small>
                                <div className="lp-deck-chips">
                                    {card.skills.map((skill) => (
                                        <span key={skill}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="lp-deck-controls">
                <button
                    type="button"
                    className="lp-deck-arrow"
                    aria-label="Previous card"
                    onClick={() => advance("prev")}
                >
                    <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <div className="lp-deck-dots" role="tablist">
                    {heroDeckCards.map((card, i) => (
                        <button
                            key={card.name}
                            type="button"
                            role="tab"
                            aria-selected={i === index}
                            aria-label={`Card ${i + 1}: ${card.name}`}
                            className={i === index ? "active" : ""}
                            onClick={() => {
                                setIndex(i);
                                setDragX(0);
                            }}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    className="lp-deck-arrow"
                    aria-label="Next card"
                    onClick={() => advance("next")}
                >
                    <ChevronRight size={18} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Landing page                                                        */
/* ------------------------------------------------------------------ */

const marqueeRoles = [
    "UI/UX Designer",
    "Backend Developer",
    "Mobile Developer",
    "Data Scientist",
    "Product Manager",
    "ML Engineer",
    "Frontend Developer",
    "Game Developer",
    "Data Analyst",
    "DevOps Engineer",
    "Copywriter",
    "3D Artist",
];

export default function LandingPage() {
    const { isAuthenticated, theme, setTheme } = useSymbio();
    const t = useTranslations();
    const isId = t.language === "id";
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                setScrolled(window.scrollY > 8);
                ticking = false;
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    const scrollToSection = (sectionId: string) => {
        document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        setMenuOpen(false);
    };

    const themeToggle = (
        <button
            type="button"
            className="lp-icon-button"
            onClick={() =>
                setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            aria-label={
                theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            }
        >
            {theme === "light" ? (
                <Moon size={17} aria-hidden="true" />
            ) : (
                <Sun size={17} aria-hidden="true" />
            )}
        </button>
    );

    const navAnchors = (
        <>
            <a
                href="#how"
                onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("how");
                }}
            >
                {t.landingHow}
            </a>
            <a
                href="#features"
                onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("features");
                }}
            >
                {t.landingFeatures}
            </a>
            <a
                href="#projects"
                onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("projects");
                }}
            >
                {isId ? "Proyek" : "Projects"}
            </a>
        </>
    );

    return (
        <div className="lp-shell">
            <div className="lp-backdrop" aria-hidden="true">
                <span className="lp-blob lp-blob-a" />
                <span className="lp-blob lp-blob-b" />
                <span className="lp-blob lp-blob-c" />
            </div>

            <header className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
                <div className="lp-nav-inner">
                    <Link to="/" className="lp-brand" aria-label="Moots home">
                        <img src="/logo-moots.svg" alt="" aria-hidden="true" />
                        <span>Moots</span>
                    </Link>

                    <nav className="lp-nav-links" aria-label="Landing navigation">
                        {navAnchors}
                    </nav>

                    <div className="lp-nav-actions">
                        {themeToggle}
                        {isAuthenticated ? (
                            <Link to="/discover" className="lp-btn lp-btn-primary">
                                {t.landingOpenApp}
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="lp-btn lp-btn-ghost">
                                    {t.signIn}
                                </Link>
                                <Link to="/signup" className="lp-btn lp-btn-primary">
                                    {t.signUp}
                                </Link>
                            </>
                        )}
                        <button
                            type="button"
                            className="lp-menu-button"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((current) => !current)}
                        >
                            {menuOpen ? (
                                <X size={20} aria-hidden="true" />
                            ) : (
                                <Menu size={20} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                <div className={`lp-mobile-menu ${menuOpen ? "is-open" : ""}`}>
                    {navAnchors}
                    <div className="lp-mobile-menu-cta">
                        {isAuthenticated ? (
                            <Link
                                to="/discover"
                                className="lp-btn lp-btn-primary"
                                onClick={() => setMenuOpen(false)}
                            >
                                {t.landingOpenApp}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="lp-btn lp-btn-ghost"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {t.signIn}
                                </Link>
                                <Link
                                    to="/signup"
                                    className="lp-btn lp-btn-primary"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {t.signUp}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* ---------------- Hero ---------------- */}
                <section className="lp-hero">
                    <div className="lp-hero-copy">
                        <p className="lp-eyebrow lp-enter" style={{ animationDelay: "0ms" }}>
                            {t.landingHeroEyebrow}
                        </p>
                        <h1 className="lp-enter" style={{ animationDelay: "80ms" }}>
                            {t.landingHeroTitle}
                        </h1>
                        <p className="lp-lede lp-enter" style={{ animationDelay: "160ms" }}>
                            {t.landingHeroBody}
                        </p>
                        <div className="lp-hero-actions lp-enter" style={{ animationDelay: "240ms" }}>
                            <Link
                                className="lp-btn lp-btn-primary lp-btn-lg"
                                to={isAuthenticated ? "/discover" : "/signup"}
                            >
                                {t.landingStartMatching}
                                <ArrowRight size={17} aria-hidden="true" />
                            </Link>
                            <Link
                                className="lp-btn lp-btn-outline lp-btn-lg"
                                to="/discover"
                            >
                                {t.landingOpenDiscover}
                            </Link>
                        </div>
                        <div className="lp-hero-metrics lp-enter" style={{ animationDelay: "320ms" }}>
                            <span>{t.landingMetricsRoles}</span>
                            <span>{t.landingMetricsSwipe}</span>
                            <span>{t.landingMetricsChats}</span>
                        </div>
                    </div>

                    <div className="lp-hero-visual lp-enter" style={{ animationDelay: "200ms" }}>
                        <HeroCardDeck />
                    </div>
                </section>

                {/* ---------------- Role marquee ---------------- */}
                <div className="lp-marquee" aria-hidden="true">
                    <div className="lp-marquee-track">
                        {[...marqueeRoles, ...marqueeRoles].map((role, i) => (
                            <span key={`${role}-${i}`}>{role}</span>
                        ))}
                    </div>
                </div>

                {/* ---------------- How it works ---------------- */}
                <section className="lp-section" id="how">
                    <Reveal>
                        <div className="lp-section-heading">
                            <p className="lp-eyebrow">{t.landingHow}</p>
                            <h2>{t.landingHowTitle}</h2>
                        </div>
                    </Reveal>
                    <div className="lp-steps">
                        {[
                            {
                                number: "01",
                                title: t.landingStepProfileTitle,
                                body: t.landingStepProfileBody,
                            },
                            {
                                number: "02",
                                title: t.landingStepSwipeTitle,
                                body: t.landingStepSwipeBody,
                            },
                            {
                                number: "03",
                                title: t.landingStepBuildTitle,
                                body: t.landingStepBuildBody,
                            },
                        ].map((step, i) => (
                            <Reveal key={step.number} delay={i * 90}>
                                <article className="lp-step-card">
                                    <span className="lp-step-number">
                                        {step.number}
                                    </span>
                                    <h3>{step.title}</h3>
                                    <p>{step.body}</p>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ---------------- Features ---------------- */}
                <section className="lp-section lp-section-alt" id="features">
                    <Reveal>
                        <div className="lp-section-heading">
                            <p className="lp-eyebrow">{t.landingFeatures}</p>
                            <h2>{t.landingFeaturesTitle}</h2>
                        </div>
                    </Reveal>
                    <div className="lp-feature-grid">
                        {[
                            {
                                icon: <Search size={20} aria-hidden="true" />,
                                text: t.landingFeatureDiscover,
                            },
                            {
                                icon: <Heart size={20} aria-hidden="true" />,
                                text: t.landingFeatureSwipe,
                            },
                            {
                                icon: (
                                    <MessageCircle
                                        size={20}
                                        aria-hidden="true"
                                    />
                                ),
                                text: t.landingFeatureChat,
                            },
                            {
                                icon: <Settings size={20} aria-hidden="true" />,
                                text: t.landingFeatureSettings,
                            },
                        ].map((feature, i) => (
                            <Reveal key={i} delay={i * 80}>
                                <article className="lp-feature-card">
                                    <span className="lp-feature-icon">
                                        {feature.icon}
                                    </span>
                                    <span>{feature.text}</span>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ---------------- Connections ---------------- */}
                <section className="lp-section" id="chat-section">
                    <Reveal>
                        <div className="lp-section-heading">
                            <p className="lp-eyebrow lp-eyebrow-accent">
                                {isId ? "KONEKSI" : "CONNECTIONS"}
                            </p>
                            <h2>Matches & Real-time Chat</h2>
                            <p className="lp-section-sub">
                                {isId
                                    ? "Setelah saling follow, langsung chat dan mulai kolaborasi. Semua pesan real-time dengan notifikasi langsung."
                                    : "After mutual follows, chat instantly and start collaborating. All messages are real-time with instant notifications."}
                            </p>
                        </div>
                    </Reveal>
                    <div className="lp-card-trio">
                        {[
                            {
                                icon: (
                                    <MessageCircle
                                        size={26}
                                        aria-hidden="true"
                                    />
                                ),
                                title: isId ? "Chat 1-on-1" : "1-on-1 Chat",
                                body: isId
                                    ? "Diskusi langsung dengan match kamu secara privat."
                                    : "Private direct messages with your matches.",
                            },
                            {
                                icon: <Users size={26} aria-hidden="true" />,
                                title: "Group Chat",
                                body: isId
                                    ? "Buat grup kolaborasi untuk proyek bersama."
                                    : "Create collaboration groups for team projects.",
                            },
                            {
                                icon: <Bell size={26} aria-hidden="true" />,
                                title: isId
                                    ? "Notifikasi Langsung"
                                    : "Instant Alerts",
                                body: isId
                                    ? "Dapatkan notifikasi real-time untuk match, pesan, dan undangan."
                                    : "Get real-time notifications for matches, messages, and invitations.",
                            },
                        ].map((item, i) => (
                            <Reveal key={item.title} delay={i * 90}>
                                <article className="lp-info-card">
                                    <span className="lp-info-icon">
                                        {item.icon}
                                    </span>
                                    <h3>{item.title}</h3>
                                    <p>{item.body}</p>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ---------------- AI assistant ---------------- */}
                <section className="lp-section lp-section-alt" id="ai-section">
                    <Reveal>
                        <div className="lp-section-heading">
                            <p className="lp-eyebrow">AI ASSISTANT</p>
                            <h2>
                                {isId
                                    ? "Asisten AI Berbasis Gemini"
                                    : "Gemini-Powered AI Assistant"}
                            </h2>
                        </div>
                    </Reveal>
                    <Reveal delay={80}>
                        <div className="lp-ai-chips">
                            {[
                                isId
                                    ? "Analisis kecocokan skill"
                                    : "Skill-fit analysis",
                                isId
                                    ? "Saran teman setim"
                                    : "Teammate suggestions",
                                isId
                                    ? "Otomatisasi pesan perkenalan"
                                    : "Icebreaker automations",
                                isId
                                    ? "Ide proyek kolaborasi"
                                    : "Collaboration project ideas",
                            ].map((text) => (
                                <span key={text} className="lp-ai-chip">
                                    <Check size={15} aria-hidden="true" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </Reveal>
                </section>

                {/* ---------------- Projects ---------------- */}
                <section className="lp-section" id="projects">
                    <Reveal>
                        <div className="lp-section-heading">
                            <p className="lp-eyebrow lp-eyebrow-accent">
                                {isId ? "PROYEK" : "PROJECTS"}
                            </p>
                            <h2>
                                {isId
                                    ? "Temukan & Buat Proyek Kolaborasi"
                                    : "Find & Create Collaboration Projects"}
                            </h2>
                            <p className="lp-section-sub">
                                {isId
                                    ? "Posting proyek, tentukan peran yang dibutuhkan, dan undang teman setim yang cocok dengan keahlian mereka."
                                    : "Post projects, define needed roles, and invite teammates matched by their skills."}
                            </p>
                        </div>
                    </Reveal>
                    <div className="lp-project-grid">
                        {[
                            {
                                icon: (
                                    <Briefcase size={20} aria-hidden="true" />
                                ),
                                title: "Project Designer",
                                desc: isId
                                    ? "Desain antarmuka dan pengalaman pengguna untuk aplikasi kolaborasi."
                                    : "Design user interfaces and experiences for collaboration apps.",
                                roles: ["UI/UX Designer", "Frontend Developer"],
                            },
                            {
                                icon: (
                                    <GraduationCap
                                        size={20}
                                        aria-hidden="true"
                                    />
                                ),
                                title: isId
                                    ? "Tim Lomba"
                                    : "Competition Team",
                                desc: isId
                                    ? "Cari anggota tim untuk hackathon atau kompetisi kampus."
                                    : "Find team members for hackathons or campus competitions.",
                                roles: ["Backend Developer", "Data Analyst"],
                            },
                            {
                                icon: <Rocket size={20} aria-hidden="true" />,
                                title: "Startup MVP",
                                desc: isId
                                    ? "Bangun Minimum Viable Product bersama co-founder potensial."
                                    : "Build a Minimum Viable Product with potential co-founders.",
                                roles: [
                                    "Fullstack Developer",
                                    "Product Manager",
                                ],
                            },
                            {
                                icon: (
                                    <FlaskConical
                                        size={20}
                                        aria-hidden="true"
                                    />
                                ),
                                title: isId
                                    ? "Proyek Riset"
                                    : "Research Project",
                                desc: isId
                                    ? "Kolaborasi riset antar program studi."
                                    : "Cross-program collaborative research.",
                                roles: ["Data Scientist", "ML Engineer"],
                            },
                        ].map((project, i) => (
                            <Reveal key={project.title} delay={i * 80}>
                                <article className="lp-project-card">
                                    <span className="lp-project-icon">
                                        {project.icon}
                                    </span>
                                    <h3>{project.title}</h3>
                                    <p>{project.desc}</p>
                                    <p className="lp-project-roles-label">
                                        {isId
                                            ? "Peran yang dibutuhkan"
                                            : "Roles needed"}
                                    </p>
                                    <div className="lp-project-roles">
                                        {project.roles.map((role) => (
                                            <span key={role}>{role}</span>
                                        ))}
                                    </div>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ---------------- CTA ---------------- */}
                <section className="lp-section">
                    <Reveal>
                        <div className="lp-cta">
                            <div className="lp-cta-inner">
                                <h2>{t.landingCtaTitle}</h2>
                                <p>{t.landingCtaBody}</p>
                                <div className="lp-hero-actions">
                                    <Link
                                        className="lp-btn lp-btn-inverse lp-btn-lg"
                                        to={
                                            isAuthenticated
                                                ? "/discover"
                                                : "/signup"
                                        }
                                    >
                                        {t.landingStartMatching}
                                        <ArrowRight
                                            size={17}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                    <Link
                                        className="lp-btn lp-btn-outline-light lp-btn-lg"
                                        to="/discover"
                                    >
                                        {t.landingOpenDiscover}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </section>
            </main>

            {/* ---------------- Footer ---------------- */}
            <footer className="lp-footer">
                <div className="lp-footer-grid">
                    <div className="lp-footer-brand">
                        <div className="lp-brand">
                            <img
                                src="/logo-moots.svg"
                                alt=""
                                aria-hidden="true"
                            />
                            <span>Moots</span>
                        </div>
                        <p>
                            {isId
                                ? "Moots membantu mahasiswa Telkom University menemukan kolaborator berdasarkan keahlian untuk proyek, lomba, dan startup."
                                : "Moots helps Telkom University students find collaborators by skill for projects, competitions, and startups."}
                        </p>
                    </div>
                    <div>
                        <h4>{isId ? "Komunitas" : "Community"}</h4>
                        <div className="lp-footer-links">
                            <a
                                href="#features"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection("features");
                                }}
                            >
                                {t.landingFeatures}
                            </a>
                            <a
                                href="#projects"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection("projects");
                                }}
                            >
                                {isId ? "Proyek" : "Projects"}
                            </a>
                            <Link to="/terms">
                                {isId
                                    ? "Ketentuan Layanan"
                                    : "Terms of Service"}
                            </Link>
                            <Link to="/privacy">
                                {isId
                                    ? "Kebijakan Privasi"
                                    : "Privacy Policy"}
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4>{isId ? "Hubungi Kami" : "Contact Us"}</h4>
                        <div className="lp-footer-links">
                            <a href="mailto:mootsindonesia@gmail.com">
                                mootsindonesia@gmail.com
                            </a>
                            <span className="lp-footer-muted">
                                {isId
                                    ? "Dukungan & saran"
                                    : "Support & feedback"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="lp-footer-bottom">
                    <p>© 2026 Moots. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
