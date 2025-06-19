
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
    // Verificar se já existe um usuário logado
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Se usuário fez login e não tem estatísticas, criar
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              // Verificar se já tem estatísticas
              const { data: existingStats } = await supabase
                .from('user_stats')
                .select('id')
                .eq('user_id', session.user.id)
                .maybeSingle();
              
              if (!existingStats) {
                console.log('Criando estatísticas para novo usuário');
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
          }, 1000);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Carregando...</p>
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
