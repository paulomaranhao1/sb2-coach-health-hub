
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
    console.log('AuthWrapper: Inicializando autenticação...');

    // Configurar listener primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('AuthWrapper: Evento de auth:', event, !!newSession);
        
        setSession(newSession);
        
        // Finalizar loading apenas após processar a sessão
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setLoading(false);
        }
      }
    );

    // Verificar sessão inicial
    const initializeSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('AuthWrapper: Sessão inicial:', !!initialSession);
        
        setSession(initialSession);
        setLoading(false);
      } catch (error) {
        console.error('AuthWrapper: Erro ao verificar sessão:', error);
        setLoading(false);
      }
    };

    initializeSession();

    // Timeout de segurança
    const timeout = setTimeout(() => {
      console.log('AuthWrapper: Timeout atingido, finalizando loading');
      setLoading(false);
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  console.log('AuthWrapper: Estado atual - loading:', loading, 'session:', !!session);

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
