import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Eye, Trash2, Flag, X, Heart } from "lucide-react";
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
                  <small>{localizeRoleLabel(candidate.role, t as any)} · {candidate.mainSkill}</small>
                  <em>{localizeMatchMessage(match.latestMessage, t as any)}</em>
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
