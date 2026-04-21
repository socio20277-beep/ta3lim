"use client";
import { useEffect, useState } from "react";
import { getVideos, deleteVideo, VideoItem, timeAgo } from "../../../store/dataStore";
import { useRouter } from "next/navigation";

export default function PsychologistVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [active, setActive] = useState<VideoItem | null>(null);
  const refresh = () => setVideos(getVideos().filter(v => v.uploaderRole === "psychologist"));
  useEffect(() => { refresh(); }, []);

  return (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>🎬 فيديوهاتي</h1>
          <p style={{ color: "var(--text-secondary)" }}>المحتوى الإرشادي الذي رفعته</p>
        </div>
        <button onClick={() => router.push("/dashboard/psychologist/upload-video")} style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", border: "none", borderRadius: 14, padding: "12px 24px", color: "white", fontFamily: "'Cairo',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>
          ⬆️ رفع فيديو جديد
        </button>
      </div>

      {videos.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎬</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 24 }}>لم ترفع أي فيديو بعد</p>
          <button onClick={() => router.push("/dashboard/psychologist/upload-video")} style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", border: "none", borderRadius: 12, padding: "12px 28px", color: "white", fontFamily: "'Cairo',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>⬆️ ارفع أول فيديو</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {videos.map(v => (
            <div key={v.id} className="video-card">
              <div className="video-thumbnail" style={{ background: "linear-gradient(135deg,#14092a,#27165a)" }} onClick={() => setActive(v)}>
                <div style={{ width: 52, height: 52, background: "rgba(139,92,246,0.25)", border: "2px solid #8b5cf6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <span style={{ fontSize: 22 }}>▶</span>
                </div>
                {v.duration && <span style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.8)", borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "white" }}>{v.duration}</span>}
                <span style={{ position: "absolute", top: 8, right: 8, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.5)", borderRadius: 8, padding: "3px 10px", fontSize: 12, color: "#8b5cf6", fontWeight: 600 }}>{v.subject}</span>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.5 }}>{v.title}</h3>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>{v.description || "لا يوجد وصف"}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                    <span>👁 {v.views}</span>
                    <span>{timeAgo(v.createdAt)}</span>
                  </div>
                  <button onClick={() => { deleteVideo(v.id); refresh(); }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "5px 12px", color: "#f87171", cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: 12, fontWeight: 600 }}>🗑 حذف</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active && (
        <div onClick={() => setActive(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} className="glass animate-fadeInUp" style={{ width: "100%", maxWidth: 820, borderRadius: 24, overflow: "hidden" }}>
            <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
              <iframe src={active.url} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} allowFullScreen title={active.title} />
            </div>
            <div style={{ padding: "20px 24px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{active.title}</h2>
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
