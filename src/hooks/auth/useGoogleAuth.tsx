
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleAuth = async () => {
    console.log('useGoogleAuth: Iniciando Google Auth...');
    setLoading(true);
    
    try {
      const redirectTo = window.location.origin;
      console.log('useGoogleAuth: URL de redirect:', redirectTo);
      
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
        console.error('useGoogleAuth: Erro Google Auth:', error);
        throw error;
      }
      
      console.log('useGoogleAuth: Google Auth iniciado');
      
    } catch (error: any) {
      console.error('useGoogleAuth: Erro na autenticação Google:', error);
      toast({
        title: "Erro na autenticação",
        description: error.message || "Erro desconhecido",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return {
    loading,
    handleGoogleAuth
  };
};
