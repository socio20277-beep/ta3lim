"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVideos, getSessions, VideoItem, SessionItem, deleteVideo, deleteSession, timeAgo, formatDate } from "../../store/dataStore";
import { useRouter } from "next/navigation";

export default function PsychologistDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  const refresh = () => {
    setVideos(getVideos().filter(v => v.uploaderRole === "psychologist"));
    setSessions(getSessions().filter(s => s.creatorRole === "psychologist"));
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>أهلاً، {user?.name} 🧠</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>لوحة النفساني — شارك المحتوى وأدر الجلسات الإرشادية</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 36 }}>
        {[
          { label: "فيديوهاتي", value: videos.length, icon: "🎬", color: "#8b5cf6" },
          { label: "جلساتي المباشرة", value: sessions.filter(s => s.isLive).length, icon: "🔴", color: "#ef4444" },
          { label: "إجمالي المشاهدات", value: videos.reduce((a, v) => a + v.views, 0), icon: "👁", color: "#06b6d4" },
          { label: "جلسات قادمة", value: sessions.filter(s => !s.isLive).length, icon: "📅", color: "#10b981" },
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
        {[
          { icon: "⬆️", label: "رفع فيديو", color: "#8b5cf6", path: "/dashboard/psychologist/upload-video", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)" },
          { icon: "💬", label: "إنشاء جلسة", color: "#06b6d4", path: "/dashboard/psychologist/create-session", bg: "rgba(6,182,212,0.15)", border: "rgba(6,182,212,0.4)" },
        ].map(a => (
          <button key={a.path} onClick={() => router.push(a.path)}
            style={{ background: a.bg, border: `1px solid ${a.border}`, borderRadius: 16, padding: 20, color: "var(--text-primary)", cursor: "pointer", fontFamily: "'Cairo',sans-serif", textAlign: "center", transition: "all 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: a.color }}>{a.label}</div>
          </button>
        ))}
      </div>

      {/* Videos */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>🎬 فيديوهاتي</h2>
          <button onClick={() => router.push("/dashboard/psychologist/videos")} style={{ background: "none", border: "none", color: "#8b5cf6", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Cairo',sans-serif" }}>عرض الكل ←</button>
        </div>
        {videos.length === 0 ? (
          <EmptyState icon="🎬" text="لم ترفع أي فيديو بعد" action="رفع فيديو" onAction={() => router.push("/dashboard/psychologist/upload-video")} color="#8b5cf6" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {videos.slice(0, 3).map(v => (
              <div key={v.id} className="card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, flexShrink: 0, background: "rgba(139,92,246,0.15)", border: "2px solid rgba(139,92,246,0.4)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎬</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{v.title}</div>
                  <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text-muted)", flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6", borderRadius: 100, padding: "1px 8px", fontWeight: 600 }}>{v.subject}</span>
                    <span>👁 {v.views}</span>
                    <span>{timeAgo(v.createdAt)}</span>
                  </div>
                </div>
                <button onClick={() => { deleteVideo(v.id); refresh(); }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "6px 12px", color: "#f87171", cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: 12, fontWeight: 600 }}>🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sessions */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>💬 جلساتي</h2>
          <button onClick={() => router.push("/dashboard/psychologist/sessions")} style={{ background: "none", border: "none", color: "#06b6d4", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Cairo',sans-serif" }}>عرض الكل ←</button>
        </div>
        {sessions.length === 0 ? (
          <EmptyState icon="💬" text="لم تنشئ أي جلسة بعد" action="إنشاء جلسة" onAction={() => router.push("/dashboard/psychologist/create-session")} color="#06b6d4" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessions.slice(0, 3).map(s => (
              <div key={s.id} className="session-card" style={{ borderColor: s.isLive ? "rgba(239,68,68,0.5)" : "rgba(139,92,246,0.25)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <h3 style={{ fontWeight: 700, fontSize: 14 }}>{s.title}</h3>
                      {s.isLive && <span style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 100, padding: "2px 10px", fontSize: 11, color: "#f87171", fontWeight: 700 }}>🔴 مباشر</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>📅 {formatDate(s.scheduledAt)}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={s.zoomLink} target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", border: "none", borderRadius: 10, padding: "8px 14px", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>🎥 فتح</a>
                    <button onClick={() => { deleteSession(s.id); refresh(); }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "7px 12px", color: "#f87171", cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: 12 }}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, text, action, onAction, color }: { icon: string; text: string; action: string; onAction: () => void; color: string }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 24px", background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: 16 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <p style={{ color: "var(--text-secondary)", marginBottom: 16, fontSize: 14 }}>{text}</p>
      <button onClick={onAction} style={{ background: color, border: "none", borderRadius: 10, padding: "10px 20px", color: "white", fontFamily: "'Cairo',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{action}</button>
    </div>
  );
}
