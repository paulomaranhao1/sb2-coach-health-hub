
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showAuthErrorToast, showAuthSuccessToast } from '@/utils/authErrorHandling';

export const usePasswordAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async (email: string) => {
    if (!email?.trim()) {
      showAuthErrorToast({ message: 'Por favor, insira seu email' });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      showAuthSuccessToast('Link mágico enviado! Verifique seu email');
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao enviar link mágico:', error);
      showAuthErrorToast(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email?.trim()) {
      showAuthErrorToast({ message: 'Digite seu email' });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      showAuthSuccessToast('Email de recuperação enviado!');
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao resetar senha:', error);
      showAuthErrorToast(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleMagicLink,
    handleForgotPassword
  };
};
