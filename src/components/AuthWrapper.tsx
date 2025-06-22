
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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('AuthWrapper: Inicializando...');
    
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('AuthWrapper: Verificando sessão inicial...');
        
        // Verificar sessão atual
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthWrapper: Erro ao verificar sessão:', error);
        } else {
          console.log('AuthWrapper: Sessão obtida:', !!currentSession);
        }

        if (isMounted) {
          setSession(currentSession);
          setInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('AuthWrapper: Erro na inicialização:', error);
        if (isMounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    // Configurar listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('AuthWrapper: Mudança de auth:', event, !!newSession);
        
        if (isMounted) {
          setSession(newSession);
          if (!initialized) {
            setInitialized(true);
            setLoading(false);
          }
        }
      }
    );

    // Inicializar
    initializeAuth();

    // Timeout de segurança para evitar loading infinito
    const timeout = setTimeout(() => {
      if (!initialized && isMounted) {
        console.warn('AuthWrapper: Timeout na inicialização, forçando loading=false');
        setInitialized(true);
        setLoading(false);
      }
    }, 5000); // 5 segundos de timeout

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [initialized]);

  console.log('AuthWrapper: Renderizando - loading:', loading, 'user:', !!session, 'initialized:', initialized);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" text="Inicializando SB2coach.ai..." />
      </div>
    );
  }

  if (!session) {
    console.log('AuthWrapper: Mostrando tela de auth');
    return <AuthScreen />;
  }

  console.log('AuthWrapper: Usuário autenticado, renderizando app');
  return <>{children}</>;
};

export default AuthWrapper;
