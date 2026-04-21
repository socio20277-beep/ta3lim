"use client";
import { useEffect, useState } from "react";
import { getVideos, VideoItem, timeAgo } from "../../../store/dataStore";

export default function StudentVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<VideoItem | null>(null);

  useEffect(() => {
    setVideos(getVideos().filter(v => v.uploaderRole === "teacher"));
  }, []);

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>📚 فيديوهات الدروس</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>شروحات وفيديوهات المعلمين</p>

      <input
        className="input-field"
        style={{ maxWidth: 400, marginBottom: 28 }}
        placeholder="🔍 ابحث عن درس أو مادة..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {filtered.map(v => (
          <VideoCardFull key={v.id} video={v} onClick={() => setActive(v)} />
        ))}
      </div>

      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function VideoCardFull({ video, onClick }: { video: VideoItem; onClick: () => void }) {
  return (
    <div className="video-card" onClick={onClick}>
      <div className="video-thumbnail" style={{ background: "linear-gradient(135deg, #0d1832, #162a54)" }}>
        <div style={{
          width: 56, height: 56, background: "rgba(79,124,255,0.25)", border: "2px solid #4f7cff",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 24 }}>▶</span>
        </div>
        {video.duration && (
          <span style={{
            position: "absolute", bottom: 8, left: 8,
            background: "rgba(0,0,0,0.8)", borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "white",
          }}>{video.duration}</span>
        )}
        <span style={{
          position: "absolute", top: 8, right: 8,
          background: "rgba(79,124,255,0.2)", border: "1px solid rgba(79,124,255,0.5)",
          borderRadius: 8, padding: "3px 10px", fontSize: 12, color: "#4f7cff", fontWeight: 600,
        }}>{video.subject}</span>
      </div>
      <div style={{ padding: "16px" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.5 }}>{video.title}</h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
          {video.description}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#4f7cff", fontWeight: 600 }}>{video.uploaderName}</span>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-muted)" }}>
            <span>👁 {video.views}</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
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
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div onClick={e => e.stopPropagation()} className="glass animate-fadeInUp" style={{ width: "100%", maxWidth: 820, borderRadius: 24, overflow: "hidden" }}>
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
          <iframe src={video.url} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} allowFullScreen title={video.title} />
        </div>
        <div style={{ padding: "20px 24px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{video.title}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 14 }}>{video.description}</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#4f7cff", fontSize: 13, fontWeight: 600 }}>{video.uploaderName}</span>
            <button onClick={onClose} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "8px 20px", color: "#f87171", cursor: "pointer", fontFamily: "'Cairo',sans-serif", fontWeight: 600 }}>
              إغلاق ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
