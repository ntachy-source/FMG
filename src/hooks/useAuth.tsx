import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type Role = "admin" | "staff" | null;

interface AuthCtx {
  user: User | null;
  session: Session | null;
  role: Role;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 1500);

    // Clean up any legacy demo flags if previously set
    try {
      window?.localStorage?.removeItem("sgh_demo_mode");
    } catch {}

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => fetchRole(s.user.id), 0);
      } else {
        setRole(null);
      }
    });

    supabase.auth.getSession()
      .then(({ data: { session: s } }) => {
        if (!mounted) return;
        if (s) {
          setSession(s);
          setUser(s?.user ?? null);
          if (s?.user) fetchRole(s.user.id);
        }
      })
      .catch((err) => {
        console.warn("Supabase session fetch:", err);
      })
      .finally(() => {
        if (mounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      sub.subscription.unsubscribe();
    };
  }, []);

  const fetchRole = async (uid: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .order("role")
        .limit(1)
        .maybeSingle();
      setRole((data?.role as Role) ?? "staff");
    } catch {
      setRole("staff");
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return (
    <Ctx.Provider value={{ user, session, role, loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
