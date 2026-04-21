"use client";
import { useEffect, useState } from "react";
import { getVideos, getSessions, VideoItem, SessionItem, formatDate } from "../../../store/dataStore";

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  useEffect(() => { setSessions(getSessions()); }, []);

  return (
    <div className="animate-fadeIn">
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>📡 الحصص المباشرة</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
        جميع الحصص المتاحة من المعلمين والنفسانيين
      </p>

      {/* Live */}
      {sessions.filter(s => s.isLive).length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div className="pulse-dot" />
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>مباشر الآن</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {sessions.filter(s => s.isLive).map(s => (
              <BigSessionCard key={s.id} session={s} isLive />
            ))}
          </div>
        </div>
      )}

      {/* All sessions */}
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📅 جميع الحصص</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sessions.map(s => <BigSessionCard key={s.id} session={s} isLive={!!s.isLive} />)}
      </div>
    </div>
  );
}

function BigSessionCard({ session, isLive }: { session: SessionItem; isLive: boolean }) {
  const color = session.creatorRole === "teacher" ? "#4f7cff" : "#8b5cf6";
  const icon = session.creatorRole === "teacher" ? "📚" : "🧠";
  return (
    <div className="session-card" style={{
      borderColor: isLive ? "rgba(239,68,68,0.5)" : undefined,
      background: isLive ? "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04))" : undefined,
    }}>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{
          width: 52, height: 52, flexShrink: 0,
          background: `${color}20`, border: `2px solid ${color}50`,
          borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>{session.title}</h3>
            {isLive && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: 100, padding: "2px 10px", fontSize: 11, color: "#f87171", fontWeight: 700,
              }}>
                <div className="pulse-dot" style={{ width: 6, height: 6 }} /> مباشر
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
            {session.description}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>👤 {session.creatorName}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>📅 {formatDate(session.scheduledAt)}</span>
            <span className="badge" style={{ background: `${color}15`, color: color, fontSize: 11 }}>
              {session.subject}
            </span>
          </div>
        </div>
        <div style={{ flexShrink: 0, alignSelf: "center" }}>
          <a
            href={session.zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: isLive ? "linear-gradient(135deg,#ef4444,#dc2626)" : `linear-gradient(135deg,${color},${color}bb)`,
              border: "none", borderRadius: 12, padding: "10px 18px",
              color: "white", fontSize: 14, fontWeight: 700, textDecoration: "none",
              boxShadow: isLive ? "0 4px 16px rgba(239,68,68,0.3)" : `0 4px 16px ${color}30`,
              whiteSpace: "nowrap",
            }}
          >
            🎥 {isLive ? "دخول فوري" : "انضم"}
          </a>
        </div>
      </div>
    </div>
  );
}
