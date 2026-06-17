import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

interface AuthContextType {
  user: User | null;
  profile: { name: string; role: "gestor" | "tecnico" } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuta mudanças (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
        // Limpa localStorage por segurança
        localStorage.removeItem("fixer_authenticated");
        localStorage.removeItem("fixer_role");
        localStorage.removeItem("fixer_user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", userId)
        .single();
      
      if (!error && data) {
        setProfile({ name: data.name, role: data.role as "gestor" | "tecnico" });
        // Mantém compatibilidade com o resto do app que ainda usa localStorage
        localStorage.setItem("fixer_authenticated", "true");
        localStorage.setItem("fixer_role", data.role);
        localStorage.setItem("fixer_user", data.name);
      }
    } catch (err) {
      console.error("Erro ao buscar profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
