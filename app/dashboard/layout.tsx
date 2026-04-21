"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth, UserRole } from "../context/AuthContext";

const navItems: Record<UserRole, { label: string; icon: string; path: string }[]> = {
  student: [
    { label: "الرئيسية", icon: "🏠", path: "/dashboard/student" },
    { label: "فيديوهات الدروس", icon: "🎬", path: "/dashboard/student/videos" },
    { label: "فيديوهات الدعم النفسي", icon: "🧠", path: "/dashboard/student/psych-videos" },
    { label: "الحصص المباشرة", icon: "📡", path: "/dashboard/student/sessions" },
  ],
  parent: [
    { label: "الرئيسية", icon: "🏠", path: "/dashboard/parent" },
    { label: "الحصص المباشرة", icon: "📡", path: "/dashboard/parent/sessions" },
    { label: "الفيديوهات", icon: "🎬", path: "/dashboard/parent/videos" },
  ],
  teacher: [
    { label: "لوحة التحكم", icon: "📊", path: "/dashboard/teacher" },
    { label: "فيديوهاتي", icon: "🎬", path: "/dashboard/teacher/videos" },
    { label: "رفع فيديو", icon: "⬆️", path: "/dashboard/teacher/upload-video" },
    { label: "حصصي", icon: "📡", path: "/dashboard/teacher/sessions" },
    { label: "إنشاء حصة", icon: "➕", path: "/dashboard/teacher/create-session" },
  ],
  psychologist: [
    { label: "لوحة التحكم", icon: "📊", path: "/dashboard/psychologist" },
    { label: "فيديوهاتي", icon: "🎬", path: "/dashboard/psychologist/videos" },
    { label: "رفع فيديو", icon: "⬆️", path: "/dashboard/psychologist/upload-video" },
    { label: "جلساتي", icon: "💬", path: "/dashboard/psychologist/sessions" },
    { label: "إنشاء جلسة", icon: "➕", path: "/dashboard/psychologist/create-session" },
  ],
};

const roleColors: Record<UserRole, string> = {
  student: "#4f7cff",
  parent: "#10b981",
  teacher: "#f59e0b",
  psychologist: "#8b5cf6",
};

const roleLabels: Record<UserRole, string> = {
  student: "تلميذ",
  parent: "ولي الأمر",
  teacher: "معلم",
  psychologist: "نفساني",
};

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 56, height: 56,
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent-blue)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }} />
          <p style={{ color: "var(--text-secondary)" }}>جارٍ التحميل...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const items = navItems[user.role] || [];
  const color = roleColors[user.role];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42,
              background: "linear-gradient(135deg, #4f7cff, #8b5cf6)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>🌟</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text-primary)" }}>
                منصة التعليم
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>الذكي</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div style={{
          margin: "0 12px 16px",
          padding: "12px 16px",
          background: `${color}12`,
          border: `1px solid ${color}30`,
          borderRadius: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38,
              background: `${color}30`,
              border: `2px solid ${color}`,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>
              {user.role === "student" ? "🎓" : user.role === "parent" ? "👪" : user.role === "teacher" ? "📚" : "🧠"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </div>
              <div style={{ fontSize: 12, color: color, fontWeight: 600 }}>
                {roleLabels[user.role]}
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "0 0 16px" }}>
          {items.map(item => (
            <button
              key={item.path}
              onClick={() => { router.push(item.path); setMobileOpen(false); }}
              className={`sidebar-link ${pathname === item.path ? "active" : ""}`}
              style={{ color: pathname === item.path ? color : undefined }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 12px 0", borderTop: "1px solid var(--border)" }}>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ color: "#f87171", width: "100%" }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Mobile header */}
        <div style={{
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }} className="mobile-header">
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "8px 12px", cursor: "pointer",
              color: "var(--text-primary)", fontSize: 18,
            }}
          >☰</button>
        </div>

        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .mobile-header { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </AuthProvider>
  );
}
