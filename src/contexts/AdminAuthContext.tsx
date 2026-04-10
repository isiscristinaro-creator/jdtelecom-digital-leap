import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = useCallback(async (user: User): Promise<AdminUser | null> => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "gerente"])
      .single();

    if (!roleData) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email || "",
      name: profile?.full_name || user.email || "",
      role: roleData.role,
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, sess) => {
        if (sess?.user) {
          setTimeout(async () => {
            const adminUser = await checkAdminRole(sess.user);
            setAdmin(adminUser);
            setLoading(false);
          }, 0);
        } else {
          setAdmin(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: sess } }) => {
      if (sess?.user) {
        const adminUser = await checkAdminRole(sess.user);
        setAdmin(adminUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkAdminRole]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    const adminUser = await checkAdminRole(data.user);
    if (!adminUser) {
      await supabase.auth.signOut();
      return { success: false, error: "Acesso negado. Você não possui permissão de administrador." };
    }

    setAdmin(adminUser);
    return { success: true };
  }, [checkAdminRole]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
