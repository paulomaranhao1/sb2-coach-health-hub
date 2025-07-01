
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
      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      showAuthErrorToast(error);
      return { error };
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
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      
      showAuthSuccessToast('Conta criada! Verifique seu email.');
      return { email, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      showAuthErrorToast(error);
      return { error };
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
