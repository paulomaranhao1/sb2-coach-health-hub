
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
    console.log('AuthWrapper: Iniciando verificação de autenticação...');

    // Limpar parâmetros do Lovable da URL imediatamente
    const cleanUrl = () => {
      const url = new URL(window.location.href);
      if (url.searchParams.has('__lovable_token')) {
        console.log('AuthWrapper: Removendo token Lovable da URL');
        url.searchParams.delete('__lovable_token');
        window.history.replaceState({}, '', url.toString());
      }
    };

    cleanUrl();

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('AuthWrapper: Auth event:', event, !!newSession);
        setSession(newSession);
        setLoading(false);
      }
    );

    // Verificar sessão inicial apenas uma vez
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('AuthWrapper: Sessão inicial encontrada:', !!initialSession);
      setSession(initialSession);
      setLoading(false);
    }).catch((error) => {
      console.error('AuthWrapper: Erro ao obter sessão:', error);
      setLoading(false);
    });

    // Timeout de segurança mais curto
    const timeout = setTimeout(() => {
      console.log('AuthWrapper: Timeout de segurança ativado');
      setLoading(false);
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" text="Verificando autenticação..." />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
