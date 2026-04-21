"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVideos, getSessions, VideoItem, SessionItem, formatDate, timeAgo } from "../../store/dataStore";

export default function ParentDashboard() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    setVideos(getVideos());
    setSessions(getSessions());
  }, []);

  const liveSessions = sessions.filter(s => s.isLive);
  const upcoming = sessions.filter(s => !s.isLive);

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>مرحباً، {user?.name} 👪</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>تابع مسيرة أبنائك التعليمية والنفسية</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 36 }}>
        {[
          { label: "الدروس المتاحة", value: videos.filter(v => v.uploaderRole === "teacher").length, icon: "📚", color: "#4f7cff" },
          { label: "الدعم النفسي", value: videos.filter(v => v.uploaderRole === "psychologist").length, icon: "🧠", color: "#8b5cf6" },
          { label: "حصص مباشرة", value: liveSessions.length, icon: "🔴", color: "#ef4444" },
          { label: "حصص قادمة", value: upcoming.length, icon: "📅", color: "#10b981" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.05))", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: "20px 24px", marginBottom: 36, display: "flex", alignItems: "flex-start", gap: 16 }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#10b981", marginBottom: 6 }}>كيف تتابع أبناءك؟</div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            يمكنك متابعة جميع الحصص المباشرة والمجدولة، وكذلك مشاهدة الفيديوهات التعليمية والإرشادية التي يتابعها أبناؤك. يمكنك أيضاً الانضمام لأي حصة عبر رابط الزوم.
          </p>
        </div>
      </div>

      {/* Live sessions */}
      {liveSessions.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div className="pulse-dot" />
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>حصص مباشرة الآن</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {liveSessions.map(s => <ParentSessionCard key={s.id} session={s} isLive />)}
          </div>
        </div>
      )}

      {/* Upcoming */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📅 الحصص القادمة</h2>
        {upcoming.length === 0 ? (
          <div style={{ padding: "32px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, textAlign: "center", color: "var(--text-secondary)" }}>لا توجد حصص مجدولة حالياً</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {upcoming.map(s => <ParentSessionCard key={s.id} session={s} />)}
          </div>
        )}
      </div>

      {/* Recent videos */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🎬 آخر الفيديوهات</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
          {videos.slice(0, 6).map(v => (
            <div key={v.id} className="video-card" onClick={() => setActiveVideo(v)} style={{ cursor: "pointer" }}>
              <div className="video-thumbnail" style={{ background: v.uploaderRole === "teacher" ? "linear-gradient(135deg,#0d1832,#162a54)" : "linear-gradient(135deg,#14092a,#27165a)" }}>
                <div style={{ width: 48, height: 48, background: v.uploaderRole === "teacher" ? "rgba(79,124,255,0.25)" : "rgba(139,92,246,0.25)", border: `2px solid ${v.uploaderRole === "teacher" ? "#4f7cff" : "#8b5cf6"}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 20 }}>▶</span>
                </div>
                <span style={{ position: "absolute", top: 8, right: 8, background: v.uploaderRole === "teacher" ? "rgba(79,124,255,0.2)" : "rgba(139,92,246,0.2)", border: `1px solid ${v.uploaderRole === "teacher" ? "rgba(79,124,255,0.5)" : "rgba(139,92,246,0.5)"}`, borderRadius: 8, padding: "3px 10px", fontSize: 11, color: v.uploaderRole === "teacher" ? "#4f7cff" : "#8b5cf6", fontWeight: 700 }}>
                  {v.uploaderRole === "teacher" ? "معلم" : "نفساني"}
                </span>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, lineHeight: 1.5 }}>{v.title}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
                  <span>{v.uploaderName}</span>
                  <span>{timeAgo(v.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div onClick={() => setActiveVideo(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} className="glass animate-fadeInUp" style={{ width: "100%", maxWidth: 820, borderRadius: 24, overflow: "hidden" }}>
            <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
              <iframe src={activeVideo.url} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} allowFullScreen title={activeVideo.title} />
            </div>
            <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{activeVideo.title}</h2>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{activeVideo.uploaderName}</span>
              </div>
              <button onClick={() => setActiveVideo(null)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "8px 20px", color: "#f87171", cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontWeight: 600 }}>إغلاق ✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ParentSessionCard({ session, isLive }: { session: SessionItem; isLive?: boolean }) {
  const color = session.creatorRole === "teacher" ? "#4f7cff" : "#8b5cf6";
  return (
    <div className="session-card" style={{ borderColor: isLive ? "rgba(239,68,68,0.5)" : undefined }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          {isLive && <div className="pulse-dot" />}
          <span style={{ fontSize: 11, fontWeight: 700, color: isLive ? "#ef4444" : color }}>{isLive ? "مباشر" : "قادم"}</span>
          <span style={{ background: `${color}15`, color, borderRadius: 100, padding: "1px 8px", fontSize: 11, fontWeight: 600 }}>{session.subject}</span>
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{session.title}</h3>
        <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{session.description}</p>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>📅 {formatDate(session.scheduledAt)}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{session.creatorName}</span>
        <a href={session.zoomLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: isLive ? "linear-gradient(135deg,#ef4444,#dc2626)" : `linear-gradient(135deg,${color},${color}bb)`, border: "none", borderRadius: 10, padding: "8px 16px", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          🎥 {isLive ? "دخول" : "انضم"}
        </a>
      </div>
    </div>
  );
}
