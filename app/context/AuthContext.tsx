"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "teacher" | "psychologist" | "parent";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, name: string, email: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("edu_user");
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = (role: UserRole, name: string, email: string) => {
    const newUser: User = {
      id: Math.random().toString(36).slice(2),
      name,
      role,
      email,
    };
    setUser(newUser);
    localStorage.setItem("edu_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("edu_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
