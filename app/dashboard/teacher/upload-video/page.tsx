"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { addVideo } from "../../../store/dataStore";
import { useRouter } from "next/navigation";

export default function TeacherUploadVideoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", subject: "", description: "", url: "", duration: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const subjects = ["رياضيات", "فيزياء", "كيمياء", "عربية", "فرنسية", "إنجليزية", "تاريخ وجغرافيا", "علوم طبيعية", "فلسفة", "أخرى"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.url) {
      setError("يرجى ملء الحقول المطلوبة");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 800));
    addVideo({
      title: form.title,
      subject: form.subject,
      description: form.description,
      url: form.url,
      duration: form.duration,
      uploadedBy: user?.id || "",
      uploaderRole: "teacher",
      uploaderName: user?.name || "",
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/dashboard/teacher/videos"), 1500);
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>⬆️ رفع فيديو جديد</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>شارك شرحك وفيديوهاتك التعليمية مع التلاميذ</p>
      </div>

      {success ? (
        <div style={{ textAlign: "center", padding: "60px 32px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#10b981", marginBottom: 10 }}>تم الرفع بنجاح!</h2>
          <p style={{ color: "var(--text-secondary)" }}>سيتم تحويلك إلى فيديوهاتك...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>
                عنوان الفيديو *
              </label>
              <input className="input-field" placeholder="مثال: شرح المعادلات التربيعية" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>
                المادة الدراسية *
              </label>
              <select
                className="input-field"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                style={{ cursor: "pointer" }}
              >
                <option value="">اختر المادة...</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>
                وصف الفيديو
              </label>
              <textarea
                className="input-field"
                placeholder="اكتب وصفاً مختصراً لمحتوى الفيديو..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>
                رابط الفيديو (YouTube / Drive) *
              </label>
              <input
                className="input-field"
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                dir="ltr"
                style={{ textAlign: "right" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>
                المدة (اختياري)
              </label>
              <input className="input-field" style={{ maxWidth: 160 }} placeholder="مثال: 15:30" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} dir="ltr" />
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", color: "#f87171", fontSize: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1, background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  border: "none", borderRadius: 14, padding: "14px",
                  color: "white", fontFamily: "'Cairo',sans-serif", fontSize: 16, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                  boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
                }}
              >
                {loading ? "جارٍ الرفع..." : "⬆️ رفع الفيديو"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: "14px 24px", color: "var(--text-secondary)",
                  fontFamily: "'Cairo',sans-serif", fontSize: 15, cursor: "pointer",
                }}
              >إلغاء</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
