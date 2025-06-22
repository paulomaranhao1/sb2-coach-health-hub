
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
    let mounted = true;

    // Configurar listener de mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id || 'no user');
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          // Usar setTimeout para operações assíncronas para evitar deadlock
          if (event === 'SIGNED_IN' && session?.user) {
            setTimeout(async () => {
              try {
                const { data: existingStats } = await supabase
                  .from('user_stats')
                  .select('id')
                  .eq('user_id', session.user.id)
                  .maybeSingle();
                
                if (!existingStats) {
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
                  console.log('User stats created for:', session.user.id);
                }
              } catch (error) {
                console.error('Erro ao criar estatísticas:', error);
              }
            }, 100);
          }
        }
      }
    );

    // DEPOIS verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
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
    return <AuthScreen />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
