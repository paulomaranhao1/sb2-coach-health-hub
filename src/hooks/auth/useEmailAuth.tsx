
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleAuthError, showAuthErrorToast, showAuthSuccessToast } from '@/utils/authErrorHandling';

export const useEmailAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (
    email: string, 
    password: string, 
    name: string, 
    isLogin: boolean,
    onEmailVerification?: () => void
  ) => {
    console.log('🔐 useEmailAuth: Iniciando', isLogin ? 'login' : 'cadastro');
    
    if (!email?.trim() || !password?.trim()) {
      showAuthErrorToast({ message: 'Preencha email e senha' });
      return;
    }

    if (!isLogin && !name?.trim()) {
      showAuthErrorToast({ message: 'Preencha seu nome' });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });
        
        if (error) throw error;
        
        console.log('✅ Login realizado com sucesso');
        showAuthSuccessToast('Login realizado com sucesso!');
        
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: { name: name.trim() },
            emailRedirectTo: window.location.origin
          }
        });
        
        if (error) throw error;
        
        if (data.user && !data.user.email_confirmed_at && onEmailVerification) {
          onEmailVerification();
          return;
        }
        
        showAuthSuccessToast('Conta criada! Verifique seu email');
      }
    } catch (error: any) {
      console.error('❌ Erro na autenticação:', error);
      showAuthErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleEmailAuth
  };
};
