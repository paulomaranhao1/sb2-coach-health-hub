
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import AuthScreen from "./AuthScreen";
import { Loading } from "./ui/loading";
import { logger } from "@/utils/logger";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logger.info('AuthWrapper: Starting authentication check');

    // Limpar token Lovable imediatamente se presente
    const url = new URL(window.location.href);
    if (url.searchParams.has('__lovable_token')) {
      logger.debug('AuthWrapper: Removing Lovable token from URL');
      url.searchParams.delete('__lovable_token');
      window.history.replaceState({}, '', url.toString());
    }

    // Configurar listener primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        logger.info('AuthWrapper: Auth state changed', { event, hasSession: !!newSession });
        setSession(newSession);
        setLoading(false);
      }
    );

    // Verificar sessão atual apenas uma vez
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      logger.info('AuthWrapper: Current session checked', { hasSession: !!currentSession });
      setSession(currentSession);
      setLoading(false);
    }).catch((error) => {
      logger.error('AuthWrapper: Error checking session', { error });
      setLoading(false);
    });

    // Timeout de segurança reduzido
    const timeout = setTimeout(() => {
      logger.warn('AuthWrapper: Timeout reached - assuming unauthenticated');
      setLoading(false);
    }, 500); // Reduzido de 1000ms para 500ms

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
