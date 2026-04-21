"use client";
import { useEffect, useState } from "react";
import { getVideos, deleteVideo, VideoItem, timeAgo } from "../../../store/dataStore";
import { useRouter } from "next/navigation";

export default function TeacherVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const refresh = () => setVideos(getVideos().filter(v => v.uploaderRole === "teacher"));
  useEffect(() => { refresh(); }, []);

  return (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>🎬 فيديوهاتي</h1>
          <p style={{ color: "var(--text-secondary)" }}>جميع الفيديوهات التي رفعتها</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/teacher/upload-video")}
          style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            border: "none", borderRadius: 14, padding: "12px 24px",
            color: "white", fontFamily: "'Cairo',sans-serif", fontSize: 15, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
          }}
        >⬆️ رفع فيديو جديد</button>
      </div>

      {videos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎬</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 24 }}>لم ترفع أي فيديو بعد</p>
          <button onClick={() => router.push("/dashboard/teacher/upload-video")} style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", borderRadius: 12, padding: "12px 28px", color: "white", fontFamily: "'Cairo',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            ⬆️ ارفع أول فيديو
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {videos.map(v => (
            <div key={v.id} className="video-card">
              <div className="video-thumbnail" style={{ background: "linear-gradient(135deg, #1a1200, #2d1f00)" }}>
                <div style={{ width: 52, height: 52, background: "rgba(245,158,11,0.25)", border: "2px solid #f59e0b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22 }}>▶</span>
                </div>
                {v.duration && <span style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.8)", borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "white" }}>{v.duration}</span>}
                <span style={{ position: "absolute", top: 8, right: 8, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.5)", borderRadius: 8, padding: "3px 10px", fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>{v.subject}</span>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.5 }}>{v.title}</h3>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>{v.description || "لا يوجد وصف"}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                    <span>👁 {v.views}</span>
                    <span>{timeAgo(v.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => { deleteVideo(v.id); refresh(); }}
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "5px 12px", color: "#f87171", cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontSize: 12, fontWeight: 600 }}
                  >🗑 حذف</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
