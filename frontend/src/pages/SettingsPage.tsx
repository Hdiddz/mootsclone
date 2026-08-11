import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Briefcase,
    Compass,
    Flag,
    Link as LinkIcon,
    LogOut,
    Search,
    Settings,
    SlidersHorizontal,
    Star,
    Trash2,
    User,
    ChevronDown,
} from "lucide-react";
import {
    useSymbio,
    useTranslations,
    PageHeader,
    Button,
    ConfirmModal,
    Avatar,
    TextField,
    TextAreaField,
    MultiChipField,
    SkillChecklist,
    MultiExperienceEditor,
    PortfolioUploadEditor,
    PhotoUploadField,
    type SettingsSection,
} from "../App";
import { supabase } from "../lib/supabase";
import {
    facultyOptions,
    roleOptions,
    collaborationGoalOptions,
} from "../mockData";
import { localizeAvailabilityLabel } from "../localize";
import type { CandidateProfile, Experience } from "../types";

const emptyExperience: Experience = {
    id: "draft-exp-1",
    title: "",
    organization: "",
    period: "",
    description: "",
    relatedSkills: [],
    link: "",
};

export default function SettingsPage() {
    const {
        profile,
        setProfile,
        language,
        setLanguage,
        addToast,
        user,
        logout,
        blockedUsers,
        unblockUser,
    } = useSymbio();
    const t = useTranslations();
    const navigate = useNavigate();
    const location = useLocation();
    const initialSection =
        (location.state as { section?: SettingsSection } | null)?.section ??
        null;

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
        language,
        skills: profile.skills,
        experiences: profile.experiences.length
            ? profile.experiences
            : [emptyExperience],
        portfolioLinks: profile.portfolioLinks.length
            ? profile.portfolioLinks
            : [
                  { label: "GitHub", url: "" },
                  { label: "Portfolio", url: "" },
              ],
        lookingFor: profile.lookingFor,
        availability: profile.availability,
        availabilityDetail: profile.availabilityDetail,
        collaborationGoals: profile.collaborationGoals,
    });
    const [activeSection, setActiveSection] = useState<null | SettingsSection>(
        initialSection,
    );
    const [settingsError, setSettingsError] = useState("");
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);
    const [logoutOpen, setLogoutOpen] = useState(false);

    const goBack = () => navigate(-1);

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

            const registeredUsers = JSON.parse(
                window.localStorage.getItem("moots.users") ||
                    window.localStorage.getItem("mutualizm.users") ||
                    "[]",
            ) as Array<{
                email: string;
                password?: string;
            }>;
            window.localStorage.setItem(
                "moots.users",
                JSON.stringify(
                    registeredUsers.map((account) =>
                        account.email === user?.email
                            ? { ...account, password: draft.newPassword }
                            : account,
                    ),
                ),
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
            statusLabel: draft.statusLabel.trim(),
            skills: draft.skills,
            experiences: draft.experiences.filter(
                (exp) => exp.title || exp.organization || exp.description,
            ),
            portfolioLinks: draft.portfolioLinks.filter(
                (link) => link.url || link.label,
            ),
            lookingFor: draft.lookingFor,
            availability: draft.availability,
            availabilityDetail: draft.availabilityDetail,
            collaborationGoals: draft.collaborationGoals,
        }));
        setLanguage(draft.language);
        addToast(t.settingsSavedTitle, t.settingsSavedBody);
        goBack();
    };

    const updateDraft = (key: keyof typeof draft, value: string) => {
        setDraft((current) => ({ ...current, [key]: value }));
    };

    const deleteAccount = () => {
        setConfirmConfig({
            title: language === "id" ? "Hapus Akun?" : "Delete Account?",
            message: t.deleteAccountConfirm,
            onConfirm: async () => {
                try {
                    const { error } = await supabase.rpc("delete_user");
                    if (error) throw error;

                    [
                        "profile",
                        "filters",
                        "passed",
                        "interested",
                        "saved",
                        "previous",
                    ].forEach((key) => {
                        [`moots.${key}`, `mutualizm.${key}`].forEach(
                            (storageKey) => {
                                window.localStorage.removeItem(storageKey);
                                window.sessionStorage.removeItem(storageKey);
                            },
                        );
                    });
                    await logout();
                    navigate("/login");
                } catch (err: any) {
                    console.error("Error deleting user account:", err);
                    addToast(
                        language === "id"
                            ? "Gagal menghapus akun"
                            : "Failed to delete account",
                        err.message ||
                            "An error occurred while deleting your account.",
                        "error",
                    );
                }
            },
        });
    };

    const sectionTitle =
        activeSection === "profile"
            ? t.settingsSectionProfile
            : activeSection === "account"
              ? t.settingsSectionAccount
              : activeSection === "preferences"
                ? t.settingsSectionPreferences
                : activeSection === "privacy"
                  ? t.settingsSectionPrivacy
                  : activeSection === "danger"
                    ? t.settingsSectionDanger
                    : activeSection === "skills"
                      ? t.mainSkillsTitle
                      : activeSection === "experience"
                        ? t.experienceTitle
                        : activeSection === "portfolio"
                          ? t.portfolioTitle
                          : activeSection === "lookingFor"
                            ? t.lookingForTitle
                            : activeSection === "status"
                              ? t.statusCollaboration
                              : t.settingsDrawerTitle;

    const backActions = activeSection ? (
        <Button
            variant="secondary"
            onClick={() => {
                setActiveSection(null);
                setSettingsError("");
            }}
        >
            <ArrowLeft size={16} aria-hidden="true" />
            {t.back}
        </Button>
    ) : (
        <Button variant="secondary" onClick={goBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            {t.back}
        </Button>
    );

    return (
        <div className="page-stack page-transition settings-page">
            <PageHeader
                eyebrow={t.settings}
                title={sectionTitle}
                action={backActions}
            />

            {/* Menu of sub-sections */}
            {activeSection === null ? (
                <div className="settings-menu">
                    <button
                        type="button"
                        className="settings-menu-item"
                        onClick={() => setActiveSection("profile")}
                    >
                        <User size={18} aria-hidden="true" />
                        <span>
                            <strong>{t.settingsSectionProfile}</strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                    <button
                        type="button"
                        className="settings-menu-item"
                        onClick={() => setActiveSection("skills")}
                    >
                        <Star size={18} aria-hidden="true" />
                        <span>
                            <strong>{t.mainSkillsTitle}</strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                    <button
                        type="button"
                        className="settings-menu-item"
                        onClick={() => setActiveSection("experience")}
                    >
                        <Briefcase size={18} aria-hidden="true" />
                        <span>
                            <strong>{t.experienceTitle}</strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                    <button
                        type="button"
                        className="settings-menu-item"
                        onClick={() => setActiveSection("portfolio")}
                    >
                        <LinkIcon size={18} aria-hidden="true" />
                        <span>
                            <strong>{t.portfolioTitle}</strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                    <button
                        type="button"
                        className="settings-menu-item"
                        onClick={() => setActiveSection("lookingFor")}
                    >
                        <Search size={18} aria-hidden="true" />
                        <span>
                            <strong>{t.lookingForTitle}</strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                    <button
                        type="button"
                        className="settings-menu-item"
                        onClick={() => setActiveSection("status")}
                    >
                        <Compass size={18} aria-hidden="true" />
                        <span>
                            <strong>{t.statusCollaboration}</strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                    <button
                        type="button"
                        className="settings-menu-item"
                        onClick={() => setActiveSection("account")}
                    >
                        <Settings size={18} aria-hidden="true" />
                        <span>
                            <strong>{t.settingsSectionAccount}</strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                    <button
                        type="button"
                        className="settings-menu-item"
                        onClick={() => setActiveSection("preferences")}
                    >
                        <SlidersHorizontal
                            size={18}
                            aria-hidden="true"
                        />
                        <span>
                            <strong>
                                {t.settingsSectionPreferences}
                            </strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                    <button
                        type="button"
                        className="settings-menu-item"
                        onClick={() => setActiveSection("privacy")}
                    >
                        <Flag size={18} aria-hidden="true" />
                        <span>
                            <strong>{t.settingsSectionPrivacy}</strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                    <button
                        type="button"
                        className="settings-menu-item danger"
                        onClick={() => setActiveSection("danger")}
                    >
                        <Trash2 size={18} aria-hidden="true" />
                        <span>
                            <strong>{t.settingsSectionDanger}</strong>
                        </span>
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className="settings-menu-chevron"
                        />
                    </button>
                </div>
            ) : null}

            {activeSection === "profile" ? (
                <div className="settings-panel">
                    <div className="settings-form-grid">
                        <TextField
                            label={t.name}
                            value={draft.name}
                            onChange={(value) =>
                                updateDraft("name", value)
                            }
                        />
                        <PhotoUploadField
                            label={t.profilePhoto}
                            value={draft.avatarUrl}
                            position={draft.avatarPosition}
                            onChange={(value) =>
                                updateDraft("avatarUrl", value)
                            }
                            onPositionChange={(value) =>
                                updateDraft("avatarPosition", value)
                            }
                        />
                        <TextField
                            label={t.campus}
                            value={draft.campus}
                            onChange={(value) =>
                                updateDraft("campus", value)
                            }
                        />
                        <label className="field settings-select-field">
                            <span>{t.facultyProgram}</span>
                            <select
                                value={
                                    facultyOptions.includes(
                                        draft.program,
                                    )
                                        ? draft.program
                                        : ""
                                }
                                onChange={(event) =>
                                    updateDraft(
                                        "program",
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    {draft.program &&
                                    !facultyOptions.includes(
                                        draft.program,
                                    )
                                        ? draft.program
                                        : language === "id"
                                          ? "Pilih fakultas"
                                          : "Select faculty"}
                                </option>
                                {facultyOptions.map((faculty) => (
                                    <option
                                        key={faculty}
                                        value={faculty}
                                    >
                                        {faculty}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <TextField
                            label={t.roleMain}
                            value={draft.role}
                            onChange={(value) =>
                                updateDraft("role", value)
                            }
                        />
                        <TextField
                            label={t.mainSkill}
                            value={draft.mainSkill}
                            onChange={(value) =>
                                updateDraft("mainSkill", value)
                            }
                        />
                        <label className="field settings-select-field">
                            <span>{t.statusBadge}</span>
                            <select
                                value={draft.statusLabel}
                                onChange={(event) =>
                                    updateDraft(
                                        "statusLabel",
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    {t.defaultStatus}
                                </option>
                                <option value="Looking for project">
                                    {t.lookingForProject}
                                </option>
                                <option value="Available this week">
                                    {t.availableThisWeek}
                                </option>
                                <option value="Busy, message first">
                                    {t.busyMessageFirst}
                                </option>
                            </select>
                        </label>
                        <TextAreaField
                            label={t.aboutProfile}
                            value={draft.bio}
                            onChange={(value) =>
                                updateDraft("bio", value)
                            }
                            minRows={4}
                        />
                    </div>

                    <div className="settings-actions">
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveSection(null)}
                            >
                                {t.back}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={saveSettings}
                            >
                                {t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {activeSection === "skills" ? (
                <div className="settings-panel">
                    <SkillChecklist
                        selected={draft.skills}
                        onChange={(skills) =>
                            setDraft((current) => ({
                                ...current,
                                skills,
                            }))
                        }
                        helper={t.skillHelper}
                    />
                    <div className="settings-actions">
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveSection(null)}
                            >
                                {t.back}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={saveSettings}
                            >
                                {t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {activeSection === "experience" ? (
                <div className="settings-panel">
                    <MultiExperienceEditor
                        experiences={draft.experiences}
                        onChange={(experiences) =>
                            setDraft((current) => ({
                                ...current,
                                experiences,
                            }))
                        }
                    />
                    <div className="settings-actions">
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveSection(null)}
                            >
                                {t.back}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={saveSettings}
                            >
                                {t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {activeSection === "portfolio" ? (
                <div className="settings-panel">
                    <PortfolioUploadEditor
                        links={draft.portfolioLinks}
                        userId={user?.id}
                        onChange={(portfolioLinks) =>
                            setDraft((current) => ({
                                ...current,
                                portfolioLinks,
                            }))
                        }
                    />
                    <div className="settings-actions">
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveSection(null)}
                            >
                                {t.back}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={saveSettings}
                            >
                                {t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {activeSection === "lookingFor" ? (
                <div className="settings-panel">
                    <MultiChipField
                        label={t.lookingForLabel}
                        values={draft.lookingFor}
                        options={roleOptions}
                        onChange={(values) =>
                            setDraft((current) => ({
                                ...current,
                                lookingFor: values,
                            }))
                        }
                    />
                    <div className="settings-actions">
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveSection(null)}
                            >
                                {t.back}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={saveSettings}
                            >
                                {t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {activeSection === "status" ? (
                <div className="settings-panel">
                    <label className="field settings-select-field">
                        <span>{t.availabilityLabel}</span>
                        <select
                            value={draft.availability}
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    availability: event.target
                                        .value as CandidateProfile["availability"],
                                }))
                            }
                        >
                            <option value="available">
                                {localizeAvailabilityLabel(
                                    "available",
                                    t,
                                )}
                            </option>
                            <option value="limited">
                                {localizeAvailabilityLabel(
                                    "limited",
                                    t,
                                )}
                            </option>
                            <option value="busy">
                                {localizeAvailabilityLabel("busy", t)}
                            </option>
                        </select>
                    </label>
                    <label className="field settings-select-field">
                        <span>{t.statusBadge}</span>
                        <select
                            value={draft.statusLabel}
                            onChange={(event) =>
                                updateDraft(
                                    "statusLabel",
                                    event.target.value,
                                )
                            }
                        >
                            <option value="">{t.defaultStatus}</option>
                            <option value="Looking for project">
                                {t.lookingForProject}
                            </option>
                            <option value="Available this week">
                                {t.availableThisWeek}
                            </option>
                            <option value="Busy, message first">
                                {t.busyMessageFirst}
                            </option>
                        </select>
                    </label>
                    <TextAreaField
                        label={t.availabilityDetails}
                        value={draft.availabilityDetail}
                        onChange={(value) =>
                            setDraft((current) => ({
                                ...current,
                                availabilityDetail: value,
                            }))
                        }
                        minRows={3}
                    />
                    <MultiChipField
                        label={t.collaborationType}
                        values={draft.collaborationGoals}
                        options={collaborationGoalOptions}
                        onChange={(values) =>
                            setDraft((current) => ({
                                ...current,
                                collaborationGoals: values,
                            }))
                        }
                    />
                    <div className="settings-actions">
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveSection(null)}
                            >
                                {t.back}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={saveSettings}
                            >
                                {t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {activeSection === "account" ? (
                <div className="settings-panel">
                    <div className="settings-security-grid">
                        <TextField
                            label={t.currentPassword}
                            value={draft.currentPassword}
                            onChange={(value) =>
                                updateDraft("currentPassword", value)
                            }
                            placeholder={t.optionalDemo}
                            type="password"
                        />
                        <TextField
                            label={t.newPassword}
                            value={draft.newPassword}
                            onChange={(value) =>
                                updateDraft("newPassword", value)
                            }
                            placeholder={t.passwordHint}
                            type="password"
                        />
                        <TextField
                            label={t.confirmNewPassword}
                            value={draft.confirmPassword}
                            onChange={(value) =>
                                updateDraft("confirmPassword", value)
                            }
                            type="password"
                        />
                    </div>
                    {settingsError ? (
                        <div className="error-box">
                            <p>{settingsError}</p>
                        </div>
                    ) : null}
                    <div className="settings-actions">
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveSection(null)}
                            >
                                {t.back}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={saveSettings}
                            >
                                {t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {activeSection === "preferences" ? (
                <div className="settings-panel">
                    <label className="field settings-select-field">
                        <span>{t.websiteLanguage}</span>
                        <select
                            value={draft.language}
                            onChange={(event) =>
                                updateDraft(
                                    "language",
                                    event.target.value,
                                )
                            }
                        >
                            <option value="id">{t.indonesian}</option>
                            <option value="en">{t.english}</option>
                        </select>
                    </label>
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
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveSection(null)}
                            >
                                {t.back}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={saveSettings}
                            >
                                {t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            {activeSection === "privacy" ? (
                <div className="settings-panel">
                    <div className="settings-blocked">
                        <p className="settings-blocked-desc">
                            {t.blockedUsersDesc}
                        </p>
                        {blockedUsers.length === 0 ? (
                            <p className="muted-text">
                                {t.noBlockedUsers}
                            </p>
                        ) : (
                            <ul className="blocked-user-list">
                                {blockedUsers.map((blocked) => (
                                    <li
                                        key={blocked.id}
                                        className="blocked-user-row"
                                    >
                                        <Avatar
                                            profile={blocked}
                                            size="xs"
                                        />
                                        <span className="blocked-user-name">
                                            {blocked.name || t.yourName}
                                        </span>
                                        <button
                                            type="button"
                                            className="blocked-unblock-btn"
                                            onClick={() =>
                                                unblockUser(blocked.id)
                                            }
                                        >
                                            {t.unblock}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ) : null}

            {activeSection === "danger" ? (
                <div className="settings-panel">
                    <div className="settings-note">
                        <strong>{t.settingsRulesTitle}</strong>
                        <p>{t.settingsRulesBody}</p>
                    </div>
                    <div className="settings-actions">
                        <Button
                            variant="ghostDanger"
                            onClick={() => setLogoutOpen(true)}
                        >
                            <LogOut size={18} aria-hidden="true" />
                            {t.logoutAccount}
                        </Button>
                        <Button
                            variant="ghostDanger"
                            onClick={deleteAccount}
                        >
                            <Trash2 size={18} aria-hidden="true" />
                            {t.deleteAccount}
                        </Button>
                    </div>
                </div>
            ) : null}

            {confirmConfig && (
                <ConfirmModal
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    onConfirm={confirmConfig.onConfirm}
                    onClose={() => setConfirmConfig(null)}
                />
            )}
            {logoutOpen && (
                <ConfirmModal
                    title={language === "id" ? "Keluar?" : "Log out?"}
                    message={
                        language === "id"
                            ? "Apakah Anda yakin ingin keluar?"
                            : "Are you sure you want to log out?"
                    }
                    onConfirm={async () => {
                        await logout();
                        navigate("/login");
                    }}
                    onClose={() => setLogoutOpen(false)}
                />
            )}
        </div>
    );
}
