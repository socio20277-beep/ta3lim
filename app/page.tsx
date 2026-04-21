"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "./context/AuthContext";

const roles = [
  {
    key: "student" as UserRole,
    label: "تلميذ",
    icon: "🎓",
    desc: "شاهد الدروس وانضم للحصص",
    color: "#4f7cff",
    gradient: "linear-gradient(135deg, #4f7cff22, #4f7cff08)",
    border: "rgba(79,124,255,0.4)",
  },
  {
    key: "parent" as UserRole,
    label: "ولي الأمر",
    icon: "👪",
    desc: "تابع تقدم أبنائك",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b98122, #10b98108)",
    border: "rgba(16,185,129,0.4)",
  },
  {
    key: "teacher" as UserRole,
    label: "معلم",
    icon: "📚",
    desc: "ارفع دروسك وأدر الحصص",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b22, #f59e0b08)",
    border: "rgba(245,158,11,0.4)",
  },
  {
    key: "psychologist" as UserRole,
    label: "نفساني",
    icon: "🧠",
    desc: "دعم نفسي وجلسات إرشادية",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf622, #8b5cf608)",
    border: "rgba(139,92,246,0.4)",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("form");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 1000));
    login(selectedRole!, name, email);
    router.push(`/dashboard/${selectedRole}`);
  };

  const selectedRoleData = roles.find(r => r.key === selectedRole);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Grid pattern */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(rgba(79,124,255,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520, padding: "24px 16px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }} className="animate-fadeInUp">
          <div style={{
            width: 72, height: 72,
            background: "linear-gradient(135deg, #4f7cff, #8b5cf6)",
            borderRadius: "22px",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, marginBottom: 16,
            boxShadow: "0 8px 32px rgba(79,124,255,0.3)",
          }}>🌟</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }} className="grad-text">
            منصة التعليم الذكي
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            بيئة تعليمية متكاملة للجميع
          </p>
        </div>

        {/* Card */}
        <div className="glass animate-fadeInUp" style={{ padding: "36px 32px", animationDelay: "0.1s" }}>
          {step === "role" ? (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
                من أنت؟
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", marginBottom: 28 }}>
                اختر دورك للوصول إلى لوحتك الخاصة
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {roles.map((role, i) => (
                  <button
                    key={role.key}
                    onClick={() => handleRoleSelect(role.key)}
                    className="animate-fadeInUp"
                    style={{
                      animationDelay: `${0.1 + i * 0.08}s`,
                      background: role.gradient,
                      border: `1px solid ${role.border}`,
                      borderRadius: 16,
                      padding: "24px 16px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.3s",
                      fontFamily: "'Cairo', sans-serif",
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${role.color}30`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 10 }}>{role.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: role.color }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {role.desc}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleLogin}>
              {/* Back */}
              <button
                type="button"
                onClick={() => { setStep("role"); setError(""); }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "6px 14px",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 13,
                  marginBottom: 24,
                  fontFamily: "'Cairo', sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                ← العودة
              </button>

              {/* Role badge */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: selectedRoleData?.gradient,
                  border: `1px solid ${selectedRoleData?.border}`,
                  borderRadius: 100,
                  padding: "8px 20px",
                }}>
                  <span style={{ fontSize: 22 }}>{selectedRoleData?.icon}</span>
                  <span style={{ fontWeight: 700, color: selectedRoleData?.color, fontSize: 16 }}>
                    {selectedRoleData?.label}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    الاسم الكامل
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="أدخل اسمك الكامل..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    البريد الإلكتروني
                  </label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    dir="ltr"
                    style={{ textAlign: "right" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    كلمة المرور
                  </label>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <div style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#f87171",
                    fontSize: 14,
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg, ${selectedRoleData?.color}, ${selectedRoleData?.color}bb)`,
                    border: "none",
                    borderRadius: 14,
                    padding: "15px",
                    color: "white",
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    transition: "all 0.3s",
                    boxShadow: `0 4px 20px ${selectedRoleData?.color}40`,
                    marginTop: 8,
                  }}
                >
                  {loading ? "جارٍ الدخول..." : "دخول →"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, marginTop: 24 }}>
          منصة التعليم الذكي © {new Date().getFullYear()} — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
