
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import AuthScreen from "./AuthScreen";
import { Loading } from "./ui/loading";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthWrapper: Iniciando sistema de autenticação otimizado...');

    // Configurar listener primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('AuthWrapper: Auth event:', event);
        setSession(newSession);
        setLoading(false);
      }
    );

    // Verificar sessão inicial uma única vez
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('AuthWrapper: Sessão inicial:', !!initialSession);
      setSession(initialSession);
      setLoading(false);
    });

    // Timeout muito menor para performance
    const timeout = setTimeout(() => {
      console.log('AuthWrapper: Timeout atingido, finalizando loading');
      setLoading(false);
    }, 500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" text="Carregando..." />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
