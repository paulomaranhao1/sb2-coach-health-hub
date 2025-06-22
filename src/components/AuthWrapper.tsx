
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import AuthScreen from './AuthScreen';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthWrapper: Inicializando...');
    let mounted = true;

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthWrapper: Auth event:', event, session?.user?.id || 'no user');
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          console.log('AuthWrapper: Estado atualizado - user:', !!session?.user, 'loading:', false);
        }
      }
    );

    // Verificar sessão inicial
    const initSession = async () => {
      try {
        console.log('AuthWrapper: Verificando sessão inicial...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthWrapper: Sessão inicial encontrada:', !!session?.user);
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          console.log('AuthWrapper: Estado inicial definido - user:', !!session?.user, 'loading:', false);
        }
      } catch (error) {
        console.error('AuthWrapper: Erro ao verificar sessão:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initSession();

    return () => {
      console.log('AuthWrapper: Cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Efeito separado para criar user_stats quando necessário
  useEffect(() => {
    if (!user) return;

    console.log('AuthWrapper: Criando user_stats se necessário para:', user.id);
    
    const createUserStatsIfNeeded = async () => {
      try {
        const { data: existingStats } = await supabase
          .from('user_stats')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!existingStats) {
          await supabase
            .from('user_stats')
            .insert({
              user_id: user.id,
              points: 0,
              level: 1,
              shields: [],
              stickers: [],
              streak: 0
            });
          console.log('AuthWrapper: User stats criado para:', user.id);
        } else {
          console.log('AuthWrapper: User stats já existe para:', user.id);
        }
      } catch (error) {
        console.error('AuthWrapper: Erro ao criar estatísticas:', error);
      }
    };

    createUserStatsIfNeeded();
  }, [user]);

  console.log('AuthWrapper: Renderizando - loading:', loading, 'user:', !!user);

  if (loading) {
    console.log('AuthWrapper: Mostrando tela de loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-base">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AuthWrapper: Mostrando AuthScreen');
    return <AuthScreen />;
  }

  console.log('AuthWrapper: Mostrando app principal');
  return <>{children}</>;
};

export default AuthWrapper;
