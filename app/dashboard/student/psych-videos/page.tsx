"use client";
import { useEffect, useState } from "react";
import { getVideos, VideoItem, timeAgo } from "../../../store/dataStore";

export default function StudentPsychVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [active, setActive] = useState<VideoItem | null>(null);

  useEffect(() => {
    setVideos(getVideos().filter(v => v.uploaderRole === "psychologist"));
  }, []);

  return (
    <div className="animate-fadeIn">
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>🧠 فيديوهات الدعم النفسي</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
        محتوى نفسي وإرشادي من النفسانيين المتخصصين
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {videos.map(v => (
          <div key={v.id} className="video-card" onClick={() => setActive(v)}>
            <div className="video-thumbnail" style={{ background: "linear-gradient(135deg, #140d2a, #271a54)" }}>
              <div style={{
                width: 56, height: 56, background: "rgba(139,92,246,0.25)", border: "2px solid #8b5cf6",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              }}><span style={{ fontSize: 24 }}>▶</span></div>
              {v.duration && (
                <span style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.8)", borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "white" }}>{v.duration}</span>
              )}
              <span style={{ position: "absolute", top: 8, right: 8, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.5)", borderRadius: 8, padding: "3px 10px", fontSize: 12, color: "#8b5cf6", fontWeight: 600 }}>{v.subject}</span>
            </div>
            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.5 }}>{v.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>{v.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#8b5cf6", fontWeight: 600 }}>{v.uploaderName}</span>
                <div style={{ color: "var(--text-muted)", display: "flex", gap: 10 }}>
                  <span>👁 {v.views}</span>
                  <span>{timeAgo(v.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {active && (
        <div onClick={() => setActive(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} className="glass animate-fadeInUp" style={{ width: "100%", maxWidth: 820, borderRadius: 24, overflow: "hidden" }}>
            <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
              <iframe src={active.url} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} allowFullScreen title={active.title} />
            </div>
            <div style={{ padding: "20px 24px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{active.title}</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 14 }}>{active.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8b5cf6", fontSize: 13, fontWeight: 600 }}>{active.uploaderName}</span>
                <button onClick={() => setActive(null)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "8px 20px", color: "#f87171", cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontWeight: 600 }}>إغلاق ✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
