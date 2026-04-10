import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);
const SESSION_KEY = "jd_admin_session";
const SESSION_EXPIRY_KEY = "jd_admin_session_expiry";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Credentials kept server-side in production; this is a temporary client-side placeholder
const ADMIN_ACCOUNTS = [
  { email: "admin@jdtelecom.com", password: "Jd@T3l3c0m2024!", name: "Administrador", role: "admin" },
  { email: "gerente@jdtelecom.com", password: "Jd@G3r3nt3!", name: "Gerente", role: "gerente" },
];

function getAttemptData(): { count: number; lockedUntil: number } {
  try {
    const raw = sessionStorage.getItem("jd_admin_attempts");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lockedUntil: 0 };
}

function setAttemptData(count: number, lockedUntil: number) {
  sessionStorage.setItem("jd_admin_attempts", JSON.stringify({ count, lockedUntil }));
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (saved && expiry) {
      try {
        if (Date.now() > Number(expiry)) {
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(SESSION_EXPIRY_KEY);
        } else {
          setAdmin(JSON.parse(saved));
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_EXPIRY_KEY);
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Rate limiting
    const attempts = getAttemptData();
    if (attempts.lockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      return { success: false, error: `Conta bloqueada. Tente novamente em ${minutesLeft} minuto(s).` };
    }

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const account = ADMIN_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (account) {
      setAttemptData(0, 0);
      const user = { email: account.email, name: account.name, role: account.role };
      setAdmin(user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
      return { success: true };
    }

    const newCount = attempts.count + 1;
    if (newCount >= MAX_ATTEMPTS) {
      setAttemptData(newCount, Date.now() + LOCKOUT_DURATION_MS);
      return { success: false, error: "Muitas tentativas. Conta bloqueada por 15 minutos." };
    }
    setAttemptData(newCount, 0);
    return { success: false, error: `Credenciais inválidas. ${MAX_ATTEMPTS - newCount} tentativa(s) restante(s).` };
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    sessionStorage.removeItem("jd_admin_attempts");
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
