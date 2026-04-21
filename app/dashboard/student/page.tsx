"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVideos, getSessions, VideoItem, SessionItem, timeAgo, formatDate } from "../../store/dataStore";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    setVideos(getVideos());
    setSessions(getSessions());
  }, []);

  const teacherVideos = videos.filter(v => v.uploaderRole === "teacher");
  const psychVideos = videos.filter(v => v.uploaderRole === "psychologist");
  const liveSessions = sessions.filter(s => s.isLive);
  const upcomingSessions = sessions.filter(s => !s.isLive);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          أهلاً، {user?.name} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          إليك ما هو جديد اليوم في منصتك التعليمية
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "دروس متاحة", value: teacherVideos.length, icon: "📚", color: "#4f7cff" },
          { label: "جلسات نفسية", value: psychVideos.length, icon: "🧠", color: "#8b5cf6" },
          { label: "حصص مباشرة", value: liveSessions.length, icon: "🔴", color: "#ef4444" },
          { label: "حصص قادمة", value: upcomingSessions.length, icon: "📅", color: "#f59e0b" },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Live sessions */}
      {liveSessions.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div className="pulse-dot" />
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>حصص مباشرة الآن</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {liveSessions.map(s => (
              <SessionCard key={s.id} session={s} isLive />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming sessions */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📅 الحصص القادمة</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {upcomingSessions.map(s => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      </div>

      {/* Teacher videos */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📚 آخر دروس المعلمين</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {teacherVideos.slice(0, 4).map(v => (
            <VideoCard key={v.id} video={v} onClick={() => setActiveVideo(v)} />
          ))}
        </div>
      </div>

      {/* Psych videos */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🧠 فيديوهات الدعم النفسي</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {psychVideos.slice(0, 4).map(v => (
            <VideoCard key={v.id} video={v} onClick={() => setActiveVideo(v)} />
          ))}
        </div>
      </div>

      {/* Video modal */}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

function SessionCard({ session, isLive }: { session: SessionItem; isLive?: boolean }) {
  const color = session.creatorRole === "teacher" ? "#4f7cff" : "#8b5cf6";
  const icon = session.creatorRole === "teacher" ? "📚" : "🧠";
  return (
    <div className="session-card" style={{ borderColor: isLive ? "rgba(239,68,68,0.4)" : undefined }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            {isLive && <div className="pulse-dot" />}
            <span style={{ fontSize: 11, fontWeight: 700, color: isLive ? "#ef4444" : color, textTransform: "uppercase" }}>
              {isLive ? "مباشر الآن" : "قادم"}
            </span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{session.title}</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{session.description}</p>
        </div>
        <span style={{ fontSize: 24 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
        📅 {formatDate(session.scheduledAt)}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {session.creatorName}
        </span>
        <a
          href={session.zoomLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: isLive ? "linear-gradient(135deg,#ef4444,#dc2626)" : `linear-gradient(135deg,${color},${color}bb)`,
            border: "none", borderRadius: 10, padding: "8px 16px",
            color: "white", fontSize: 13, fontWeight: 700,
            cursor: "pointer", textDecoration: "none",
            boxShadow: isLive ? "0 4px 16px rgba(239,68,68,0.3)" : `0 4px 16px ${color}30`,
          }}
        >
          🎥 انضم الآن
        </a>
      </div>
    </div>
  );
}

function VideoCard({ video, onClick }: { video: VideoItem; onClick: () => void }) {
  const color = video.uploaderRole === "teacher" ? "#4f7cff" : "#8b5cf6";
  return (
    <div className="video-card" onClick={onClick}>
      <div className="video-thumbnail">
        <div style={{
          width: 56, height: 56,
          background: `${color}30`,
          border: `2px solid ${color}`,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 24 }}>▶</span>
        </div>
        {video.duration && (
          <span style={{
            position: "absolute", bottom: 8, left: 8,
            background: "rgba(0,0,0,0.8)", borderRadius: 6,
            padding: "3px 8px", fontSize: 12, color: "white",
          }}>{video.duration}</span>
        )}
        <span style={{
          position: "absolute", top: 8, right: 8,
          background: `${color}25`, border: `1px solid ${color}60`,
          borderRadius: 8, padding: "3px 10px", fontSize: 12, color: color, fontWeight: 600,
        }}>{video.subject}</span>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.5 }}>{video.title}</h3>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, lineHeight: 1.5 }}>
          {video.description.slice(0, 70)}...
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{video.uploaderName}</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>👁 {video.views}</span>
        </div>
      </div>
    </div>
  );
}

function VideoModal({ video, onClose }: { video: VideoItem; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass animate-fadeInUp"
        style={{ width: "100%", maxWidth: 820, borderRadius: 24, overflow: "hidden" }}
      >
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
          <iframe
            src={video.url}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            allowFullScreen
            title={video.title}
          />
        </div>
        <div style={{ padding: "20px 24px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{video.title}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 12 }}>{video.description}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
              بواسطة: {video.uploaderName}
            </span>
            <button
              onClick={onClose}
              style={{
                background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10, padding: "8px 20px", color: "#f87171",
                cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: 14, fontWeight: 600,
              }}
            >
              إغلاق ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
