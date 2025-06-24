
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showAuthErrorToast } from '@/utils/authErrorHandling';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    console.log('🔐 Iniciando Google Auth...');
    setLoading(true);
    
    try {
      const redirectTo = window.location.origin;
      console.log('🔗 URL de redirect:', redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('❌ Erro Google Auth:', error);
        throw error;
      }
      
      console.log('✅ Google Auth iniciado com sucesso');
      
    } catch (error: any) {
      console.error('❌ Erro na autenticação Google:', error);
      showAuthErrorToast(error);
      setLoading(false);
    }
  };

  return {
    loading,
    handleGoogleAuth
  };
};
