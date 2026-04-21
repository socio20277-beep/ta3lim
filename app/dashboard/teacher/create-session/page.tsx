"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { addSession } from "../../../store/dataStore";
import { useRouter } from "next/navigation";

export default function TeacherCreateSessionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", subject: "", description: "", zoomLink: "", scheduledAt: "", isLive: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const subjects = ["رياضيات", "فيزياء", "كيمياء", "عربية", "فرنسية", "إنجليزية", "تاريخ وجغرافيا", "علوم طبيعية", "فلسفة", "أخرى"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.zoomLink || !form.scheduledAt) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 800));
    addSession({
      title: form.title,
      subject: form.subject,
      description: form.description,
      zoomLink: form.zoomLink,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      createdBy: user?.id || "",
      creatorRole: "teacher",
      creatorName: user?.name || "",
      isLive: form.isLive,
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/dashboard/teacher/sessions"), 1500);
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>➕ إنشاء حصة مباشرة</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>أضف رابط الزوم مع تفاصيل الحصة لتلاميذك</p>
      </div>

      {success ? (
        <div style={{ textAlign: "center", padding: "60px 32px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#10b981", marginBottom: 10 }}>تم إنشاء الحصة!</h2>
          <p style={{ color: "var(--text-secondary)" }}>سيتم تحويلك إلى حصصك...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>اسم الحصة *</label>
              <input className="input-field" placeholder="مثال: حصة الرياضيات - الفصل الثالث" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>موضوع الحصة / المادة *</label>
              <select className="input-field" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={{ cursor: "pointer" }}>
                <option value="">اختر المادة...</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>وصف الحصة</label>
              <textarea className="input-field" placeholder="اشرح ما سيتم تناوله في هذه الحصة..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ resize: "vertical" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>رابط غرفة Zoom *</label>
              <input className="input-field" placeholder="https://zoom.us/j/..." value={form.zoomLink} onChange={e => setForm(f => ({ ...f, zoomLink: e.target.value }))} dir="ltr" style={{ textAlign: "right" }} />
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>💡 يمكن أيضاً استخدام Google Meet أو Microsoft Teams أو أي تطبيق مشابه</p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 600 }}>تاريخ ووقت الحصة *</label>
              <input className="input-field" type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} style={{ cursor: "pointer" }} />
            </div>

            {/* Live toggle */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: form.isLive ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${form.isLive ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
              borderRadius: 14, padding: "16px 20px", cursor: "pointer",
              transition: "all 0.3s",
            }}
              onClick={() => setForm(f => ({ ...f, isLive: !f.isLive }))}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: form.isLive ? "#f87171" : "var(--text-primary)" }}>
                  {form.isLive ? "🔴 الحصة مباشرة الآن" : "📅 حصة مجدولة"}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {form.isLive ? "ستظهر للتلاميذ فوراً كحصة مباشرة" : "ستظهر كحصة قادمة في التقويم"}
                </div>
              </div>
              <div style={{
                width: 48, height: 26,
                background: form.isLive ? "#ef4444" : "var(--bg-card)",
                border: `2px solid ${form.isLive ? "#ef4444" : "var(--border)"}`,
                borderRadius: 100, position: "relative", transition: "all 0.3s",
              }}>
                <div style={{
                  position: "absolute", top: 2,
                  right: form.isLive ? 2 : undefined,
                  left: form.isLive ? undefined : 2,
                  width: 18, height: 18,
                  background: "white", borderRadius: "50%",
                  transition: "all 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }} />
              </div>
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
                  flex: 1, background: "linear-gradient(135deg, #4f7cff, #8b5cf6)",
                  border: "none", borderRadius: 14, padding: 14,
                  color: "white", fontFamily: "'Cairo',sans-serif", fontSize: 16, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                  boxShadow: "0 4px 20px rgba(79,124,255,0.3)",
                }}
              >{loading ? "جارٍ الإنشاء..." : "📡 إنشاء الحصة"}</button>
              <button type="button" onClick={() => router.back()} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 24px", color: "var(--text-secondary)", fontFamily: "'Cairo',sans-serif", fontSize: 15, cursor: "pointer" }}>
                إلغاء
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
