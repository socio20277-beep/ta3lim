"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVideos, getSessions, VideoItem, SessionItem, deleteVideo, deleteSession, timeAgo, formatDate } from "../../store/dataStore";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  const refresh = () => {
    setVideos(getVideos().filter(v => v.uploaderRole === "teacher"));
    setSessions(getSessions().filter(s => s.creatorRole === "teacher"));
  };

  useEffect(() => { refresh(); }, []);

  const handleDeleteVideo = (id: string) => {
    deleteVideo(id);
    refresh();
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
    refresh();
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          أهلاً، {user?.name} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          لوحة تحكم المعلم — أدر محتواك وحصصك
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 36 }}>
        {[
          { label: "فيديوهاتي", value: videos.length, icon: "🎬", color: "#f59e0b" },
          { label: "حصصي المباشرة", value: sessions.filter(s => s.isLive).length, icon: "🔴", color: "#ef4444" },
          { label: "إجمالي المشاهدات", value: videos.reduce((a, v) => a + v.views, 0), icon: "👁", color: "#4f7cff" },
          { label: "الحصص القادمة", value: sessions.filter(s => !s.isLive).length, icon: "📅", color: "#10b981" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40, maxWidth: 500 }}>
        <button
          onClick={() => router.push("/dashboard/teacher/upload-video")}
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
            border: "1px solid rgba(245,158,11,0.4)", borderRadius: 16, padding: "20px",
            color: "var(--text-primary)", cursor: "pointer", fontFamily: "'Cairo',sans-serif",
            textAlign: "center", transition: "all 0.3s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>⬆️</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#f59e0b" }}>رفع فيديو</div>
        </button>
        <button
          onClick={() => router.push("/dashboard/teacher/create-session")}
          style={{
            background: "linear-gradient(135deg, rgba(79,124,255,0.15), rgba(79,124,255,0.05))",
            border: "1px solid rgba(79,124,255,0.4)", borderRadius: 16, padding: "20px",
            color: "var(--text-primary)", cursor: "pointer", fontFamily: "'Cairo',sans-serif",
            textAlign: "center", transition: "all 0.3s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>➕</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#4f7cff" }}>إنشاء حصة</div>
        </button>
      </div>

      {/* My videos */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🎬 فيديوهاتي</h2>
        {videos.length === 0 ? (
          <EmptyState icon="🎬" text="لم ترفع أي فيديو بعد" action="رفع فيديو" onAction={() => router.push("/dashboard/teacher/upload-video")} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {videos.map(v => (
              <div key={v.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48, height: 48, flexShrink: 0,
                  background: "rgba(245,158,11,0.15)", border: "2px solid rgba(245,158,11,0.4)",
                  borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>🎬</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{v.title}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-muted)", flexWrap: "wrap" }}>
                    <span className="badge" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>{v.subject}</span>
                    <span>👁 {v.views} مشاهدة</span>
                    <span>{timeAgo(v.createdAt)}</span>
                    {v.duration && <span>⏱ {v.duration}</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteVideo(v.id)}
                  style={{
                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 10, padding: "7px 14px", color: "#f87171",
                    cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: 13, fontWeight: 600,
                  }}
                >🗑 حذف</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My sessions */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📡 حصصي</h2>
        {sessions.length === 0 ? (
          <EmptyState icon="📡" text="لم تنشئ أي حصة بعد" action="إنشاء حصة" onAction={() => router.push("/dashboard/teacher/create-session")} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessions.map(s => (
              <div key={s.id} className="session-card">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <h3 style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</h3>
                      {s.isLive && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 100, padding: "2px 10px", fontSize: 11, color: "#f87171", fontWeight: 700 }}>
                          <div className="pulse-dot" style={{ width: 6, height: 6 }} /> مباشر
                        </span>
                      )}
                      <span className="badge" style={{ background: "rgba(79,124,255,0.1)", color: "#4f7cff", fontSize: 11 }}>{s.subject}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{s.description}</p>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>📅 {formatDate(s.scheduledAt)}</div>
                    <div style={{ fontSize: 12, color: "#4f7cff" }}>🔗 {s.zoomLink}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteSession(s.id)}
                    style={{
                      flexShrink: 0, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 10, padding: "7px 14px", color: "#f87171", cursor: "pointer",
                      fontFamily: "'Cairo',sans-serif", fontSize: 13, fontWeight: 600,
                    }}
                  >🗑 حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, text, action, onAction }: { icon: string; text: string; action: string; onAction: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: 16 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <p style={{ color: "var(--text-secondary)", marginBottom: 20, fontSize: 15 }}>{text}</p>
      <button
        onClick={onAction}
        style={{
          background: "linear-gradient(135deg, #4f7cff, #8b5cf6)", border: "none",
          borderRadius: 12, padding: "10px 24px", color: "white",
          fontFamily: "'Cairo',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}
      >{action}</button>
    </div>
  );
}
