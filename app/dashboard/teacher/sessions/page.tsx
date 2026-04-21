"use client";
import { useEffect, useState } from "react";
import { getSessions, deleteSession, SessionItem, formatDate } from "../../../store/dataStore";
import { useRouter } from "next/navigation";

export default function TeacherSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  const refresh = () => setSessions(getSessions().filter(s => s.creatorRole === "teacher"));
  useEffect(() => { refresh(); }, []);

  return (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>📡 حصصي المباشرة</h1>
          <p style={{ color: "var(--text-secondary)" }}>إدارة حصصك وروابط الزوم</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/teacher/create-session")}
          style={{ background: "linear-gradient(135deg,#4f7cff,#8b5cf6)", border: "none", borderRadius: 14, padding: "12px 24px", color: "white", fontFamily: "'Cairo',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(79,124,255,0.3)" }}
        >➕ حصة جديدة</button>
      </div>

      {sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📡</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 24 }}>لم تنشئ أي حصة بعد</p>
          <button onClick={() => router.push("/dashboard/teacher/create-session")} style={{ background: "linear-gradient(135deg,#4f7cff,#8b5cf6)", border: "none", borderRadius: 12, padding: "12px 28px", color: "white", fontFamily: "'Cairo',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            ➕ أنشئ أول حصة
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sessions.map(s => (
            <div key={s.id} className="session-card" style={{ borderColor: s.isLive ? "rgba(239,68,68,0.5)" : undefined }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 50, height: 50, flexShrink: 0, background: s.isLive ? "rgba(239,68,68,0.15)" : "rgba(79,124,255,0.15)", border: `2px solid ${s.isLive ? "rgba(239,68,68,0.5)" : "rgba(79,124,255,0.4)"}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {s.isLive ? "🔴" : "📡"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</h3>
                    {s.isLive && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 100, padding: "2px 10px", fontSize: 11, color: "#f87171", fontWeight: 700 }}>
                        <div className="pulse-dot" style={{ width: 6, height: 6 }} /> مباشر
                      </span>
                    )}
                    <span style={{ background: "rgba(79,124,255,0.1)", color: "#4f7cff", borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>{s.subject}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{s.description}</p>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>📅 {formatDate(s.scheduledAt)}</div>
                  <div style={{ fontSize: 12, color: "#4f7cff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🔗 {s.zoomLink}</div>
                </div>
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href={s.zoomLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.isLive ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#4f7cff,#8b5cf6)", border: "none", borderRadius: 10, padding: "8px 16px", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                    🎥 فتح
                  </a>
                  <button onClick={() => { deleteSession(s.id); refresh(); }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "7px 14px", color: "#f87171", cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: 13, fontWeight: 600 }}>
                    🗑 حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
