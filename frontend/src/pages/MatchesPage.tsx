import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreVertical, Eye, Trash2, Flag, X, Plus, Users } from "lucide-react";
import { CandidateProfile } from "../types";
import {
  useSymbio,
  useTranslations,
  BeelineIntro,
  EmptyState,
  Avatar,
  getCandidate,
  localizeRoleLabel,
  localizeMatchMessage,
  CandidateDetailSheet
} from "../App";

export default function MatchesPage() {
  const { matches, removeMatch, addToast, createGroupChat, fetchDiscoverAndMatches, user, interestedIds, incomingInterests } = useSymbio();
  const t = useTranslations();
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState("");
  const [detailProfile, setDetailProfile] = useState<CandidateProfile | null>(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]);
  const [groupError, setGroupError] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchDiscoverAndMatches(user.id);
    }
  }, [user?.id, fetchDiscoverAndMatches]);

  const approvedMatches = matches.filter((match) =>
    !match.isGroup && (
      (interestedIds || []).includes(match.candidateId) &&
      (incomingInterests || []).includes(match.candidateId)
    )
  );

  const [selectedId, setSelectedId] = useState(approvedMatches[0]?.id ?? "");

  useEffect(() => {
    if (!approvedMatches.some((match) => match.id === selectedId)) {
      setSelectedId(approvedMatches[0]?.id ?? "");
    }
  }, [approvedMatches, selectedId]);

  if (!approvedMatches.length) {
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

  const selected = approvedMatches.find((match) => match.id === selectedId) ?? approvedMatches[0];
  const directMatches = approvedMatches.filter((match) => !match.isGroup && getCandidate(match.candidateId));
  const showPrototypeActionToast = (title: string, body: string) => addToast(title, body);

  const toggleGroupMember = (candidateId: string) => {
    setGroupError("");
    setGroupMemberIds((current) =>
      current.includes(candidateId)
        ? current.filter((id) => id !== candidateId)
        : [...current, candidateId]
    );
  };

  const submitGroup = async () => {
    if (groupMemberIds.length < 2) {
      setGroupError(t.groupMemberRequired);
      return;
    }

    const groupId = await createGroupChat(groupTitle, groupMemberIds);
    setGroupModalOpen(false);
    setGroupTitle("");
    setGroupMemberIds([]);
    navigate(`/chat/${groupId}`);
  };

  return (
    <div className="page-stack beeline-page page-transition">
      <div className="matches-header-row">
        <BeelineIntro />
        <ButtonLike onClick={() => setGroupModalOpen(true)}>
          <Plus size={17} aria-hidden="true" />
          {t.newGroup}
        </ButtonLike>
      </div>
      <div className="matches-grid">
        <section className="match-list" aria-label="Match list">
          {approvedMatches.map((match) => {
            const candidate = match.isGroup ? null : getCandidate(match.candidateId);
            if (!candidate && !match.isGroup) {
              return null;
            }
            const displayName = match.isGroup ? (match.title || t.groupChat) : candidate!.name;
            const displayMeta = match.isGroup
              ? `${match.memberIds?.length || 0} ${t.groupMembers.toLowerCase()}`
              : `${localizeRoleLabel(candidate!.role, t as any)} · ${candidate!.mainSkill}`;
            const displayLatest = match.isGroup
              ? (match.latestMessage || match.summary.join(", "))
              : localizeMatchMessage(match.latestMessage, t as any);

            return (
              <article
                className={`match-row ${match.id === selected.id ? "selected" : ""} ${match.isGroup ? "group-match-row" : ""}`}
                key={match.id}
                onClick={() => setSelectedId(match.id)}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setSelectedId(match.id);
                  }
                }}
                style={candidate?.avatarUrl ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.78)), url(${candidate.avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              >
                {candidate ? <Avatar profile={candidate} size="sm" /> : <span className="group-avatar"><Users size={21} /></span>}
                <span>
                  <strong>{displayName}</strong>
                  <small>{displayMeta}</small>
                  <em>{displayLatest}</em>
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
                      if (candidate) setDetailProfile(candidate);
                    }}
                    disabled={!candidate}
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
                </div>
                {openMenuId === match.id ? (
                  <div className="match-menu-panel" onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      className="match-menu-close-btn"
                      onClick={() => setOpenMenuId("")}
                      aria-label="Close menu"
                    >
                      <X size={15} aria-hidden="true" />
                    </button>
                    {candidate ? (
                      <button type="button" onClick={() => { setDetailProfile(candidate); setOpenMenuId(""); }}>
                        <Eye size={15} aria-hidden="true" />
                        {t.viewProfile}
                      </button>
                    ) : null}
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
              </article>
            );
          })}
        </section>
      </div>
      {groupModalOpen ? (
        <div className="overlay confirm-overlay" role="presentation" onClick={() => setGroupModalOpen(false)}>
          <section className="confirm-modal group-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h2>{t.newGroup}</h2>
            <p>{t.groupMembers}</p>
            <label className="field">
              <span>{t.groupName}</span>
              <input
                value={groupTitle}
                onChange={(event) => setGroupTitle(event.target.value)}
                placeholder={t.groupNamePlaceholder}
              />
            </label>
            <div className="group-member-list">
              {directMatches.map((match) => {
                const candidate = getCandidate(match.candidateId)!;
                return (
                  <label key={candidate.id} className={groupMemberIds.includes(candidate.id) ? "selected" : ""}>
                    <input
                      type="checkbox"
                      checked={groupMemberIds.includes(candidate.id)}
                      onChange={() => toggleGroupMember(candidate.id)}
                    />
                    <Avatar profile={candidate} size="xs" />
                    <span>
                      <strong>{candidate.name}</strong>
                      <small>{candidate.mainSkill}</small>
                    </span>
                  </label>
                );
              })}
            </div>
            {groupError ? <p className="error-text">{groupError}</p> : null}
            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={() => setGroupModalOpen(false)}>
                {t.cancel}
              </button>
              <button type="button" className="button button-primary" onClick={submitGroup}>
                {t.createGroup}
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {detailProfile ? (
        <CandidateDetailSheet profile={detailProfile} onClose={() => setDetailProfile(null)} />
      ) : null}
    </div>
  );
}

function ButtonLike({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="button button-primary matches-group-button" onClick={onClick}>
      {children}
    </button>
  );
}
