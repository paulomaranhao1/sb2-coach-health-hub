
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { showAuthSuccessToast, showAuthErrorToast } from '@/utils/authErrorHandling';

export const useEmailAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      showAuthSuccessToast('Login realizado com sucesso!');
    } catch (error: any) {
      showAuthErrorToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      showAuthSuccessToast('Conta criada! Verifique seu email.');
      return { email };
    } catch (error: any) {
      showAuthErrorToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    loading
  };
};
