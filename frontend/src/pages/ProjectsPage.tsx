import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Users, Calendar } from "lucide-react";
import { useSymbio, useTranslations, EmptyState, PageHeader } from "../App";
import { supabase } from "../lib/supabase";

export default function ProjectsPage() {
  const { user, language } = useSymbio();
  const t = useTranslations();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(`*, project_members(*)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    try {
      const { data: newProject, error } = await supabase
        .from("projects")
        .insert({
          creator_id: user.id,
          title: title.trim(),
          summary: summary.trim(),
          status: "open"
        })
        .select()
        .single();

      if (error) throw error;

      if (newProject) {
        await supabase.from("project_members").insert({
          project_id: newProject.id,
          user_id: user.id,
          role: "creator"
        });
        setModalOpen(false);
        setTitle("");
        setSummary("");
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const handleJoin = async (projectId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("project_members").insert({
        project_id: projectId,
        user_id: user.id,
        role: "member"
      });

      if (error) throw error;
      fetchProjects();
    } catch (err) {
      console.error("Failed to join project:", err);
    }
  };

  return (
    <div className="page-stack page-transition fade-in">
      <PageHeader
        eyebrow={language === "id" ? "Proyek" : "Projects"}
        title={language === "id" ? "Temukan proyek atau cari rekan tim" : "Find projects or recruit teammates"}
        action={
          <button className="button button-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} style={{ marginRight: 6 }} />
            {language === "id" ? "Buat Proyek" : "Create Project"}
          </button>
        }
      />

      <main className="project-grid" style={{ padding: "0 20px" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
            {language === "id" ? "Memuat..." : "Loading..."}
          </p>
        ) : projects.length === 0 ? (
          <EmptyState
            title={language === "id" ? "Belum ada proyek" : "No projects yet"}
            body={language === "id" ? "Jadilah yang pertama membuat proyek kolaborasi!" : "Be the first to create a collaboration project!"}
            action={
              <button className="button button-primary" onClick={() => setModalOpen(true)}>
                {language === "id" ? "Buat Proyek Baru" : "Create New Project"}
              </button>
            }
          />
        ) : (
          projects.map((proj) => {
            const isCreator = proj.creator_id === user?.id;
            const isMember = proj.project_members?.some((m: any) => m.user_id === user?.id);

            return (
              <article key={proj.id} className="project-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <h2 style={{ fontSize: "1.15rem", margin: 0, fontWeight: 700 }}>{proj.title}</h2>
                  <span className="project-status">{proj.status}</span>
                </div>

                <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.45, margin: "8px 0 16px 0", minHeight: "50px" }}>
                  {proj.summary || (language === "id" ? "Tidak ada deskripsi." : "No description provided.")}
                </p>

                <div className="project-footer">
                  <div style={{ display: "flex", gap: "12px", color: "var(--muted)", fontSize: "0.78rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Users size={14} />
                      {proj.project_members?.length || 0}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={14} />
                      {new Date(proj.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {isCreator ? (
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)" }}>
                      {language === "id" ? "Pembuat" : "Owner"}
                    </span>
                  ) : isMember ? (
                    <button className="button button-secondary" disabled style={{ padding: "4px 10px", fontSize: "0.75rem", minHeight: "28px" }}>
                      {language === "id" ? "Bergabung" : "Joined"}
                    </button>
                  ) : (
                    <button
                      className="button button-primary"
                      onClick={() => handleJoin(proj.id)}
                      style={{ padding: "4px 12px", fontSize: "0.75rem", minHeight: "28px" }}
                    >
                      {language === "id" ? "Gabung" : "Join"}
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </main>

      {modalOpen && createPortal(
        <div className="overlay confirm-overlay" role="presentation" onClick={() => setModalOpen(false)}>
          <section className="confirm-modal group-modal" role="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>{language === "id" ? "Buat Proyek Baru" : "Create New Project"}</h2>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              <label className="field">
                <span>{language === "id" ? "Nama Proyek" : "Project Name"}</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span>{language === "id" ? "Deskripsi" : "Description"}</span>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={language === "id" ? "Ceritakan tentang proyek ini..." : "Tell us about this project..."}
                />
              </label>
              <div className="modal-actions" style={{ marginTop: "8px" }}>
                <button type="button" className="button button-secondary" onClick={() => setModalOpen(false)}>
                  {language === "id" ? "Batal" : "Cancel"}
                </button>
                <button type="submit" className="button button-primary">
                  {language === "id" ? "Simpan" : "Save"}
                </button>
              </div>
            </form>
          </section>
        </div>,
        document.body
      )}
    </div>
  );
}
