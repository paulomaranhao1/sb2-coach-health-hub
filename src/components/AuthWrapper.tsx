
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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Buscar sessão atual primeiro
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
        }
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          setInitialized(true);
          
          // Criar estatísticas apenas se usuário logado e não existir
          if (session?.user) {
            try {
              const { data: existingStats } = await supabase
                .from('user_stats')
                .select('id')
                .eq('user_id', session.user.id)
                .maybeSingle();
              
              if (!existingStats) {
                console.log('Criando estatísticas para usuário:', session.user.id);
                await supabase
                  .from('user_stats')
                  .insert({
                    user_id: session.user.id,
                    points: 0,
                    level: 1,
                    shields: [],
                    stickers: [],
                    streak: 0
                  });
              }
            } catch (error) {
              console.error('Erro ao criar estatísticas:', error);
            }
          }
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id || 'no user');
        
        if (!mounted || !initialized) return;
        
        setUser(session?.user ?? null);
        
        // Processar eventos específicos após inicialização
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: existingStats } = await supabase
              .from('user_stats')
              .select('id')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            if (!existingStats) {
              console.log('Criando estatísticas após login');
              await supabase
                .from('user_stats')
                .insert({
                  user_id: session.user.id,
                  points: 0,
                  level: 1,
                  shields: [],
                  stickers: [],
                  streak: 0
                });
            }
          } catch (error) {
            console.error('Erro ao processar login:', error);
          }
        }
      }
    );

    // Inicializar autenticação
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Carregando SB2coach.ai...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
