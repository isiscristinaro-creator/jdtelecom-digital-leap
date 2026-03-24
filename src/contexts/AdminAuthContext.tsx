import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);
const SESSION_KEY = "jd_admin_session";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try { setAdmin(JSON.parse(saved)); } catch { localStorage.removeItem(SESSION_KEY); }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    if (email === "admin@jdtelecom.com" && password === "123456") {
      const user = { email, name: "Administrador", role: "admin" };
      setAdmin(user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem(SESSION_KEY);
  };

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
