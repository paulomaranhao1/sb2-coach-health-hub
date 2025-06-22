
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
    console.log('AuthWrapper: Iniciando configuração de autenticação...');

    // Configurar listener de auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('AuthWrapper: Auth event:', event);
        console.log('AuthWrapper: Nova sessão:', !!newSession);
        
        setSession(newSession);
        
        // Finalizar loading para todos os eventos relevantes
        if (event !== 'TOKEN_REFRESHED') {
          setLoading(false);
        }
      }
    );

    // Verificar sessão inicial apenas uma vez
    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthWrapper: Erro ao verificar sessão inicial:', error);
        } else {
          console.log('AuthWrapper: Sessão inicial encontrada:', !!initialSession);
          setSession(initialSession);
        }
      } catch (error) {
        console.error('AuthWrapper: Erro na verificação inicial:', error);
      } finally {
        setLoading(false);
      }
    };

    checkInitialSession();

    // Timeout de segurança reduzido
    const timeout = setTimeout(() => {
      console.log('AuthWrapper: Timeout de segurança atingido');
      setLoading(false);
    }, 1000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  console.log('AuthWrapper: Estado - loading:', loading, 'session:', !!session);

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
