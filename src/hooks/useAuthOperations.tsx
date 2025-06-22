
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Erro Google Auth:', error);
      toast({
        title: "Erro na autenticação com Google",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (email: string) => {
    if (!email?.trim()) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Link enviado!",
        description: "Verifique seu email.",
      });
      return true;
    } catch (error: any) {
      console.error('Erro Magic Link:', error);
      toast({
        title: "Erro ao enviar link",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (
    email: string, 
    password: string, 
    name: string, 
    isLogin: boolean,
    onEmailVerification?: () => void
  ) => {
    if (!email?.trim() || !password?.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha.",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && !name?.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Preencha seu nome.",
        variant: "destructive"
      });
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
        
        toast({
          title: "Login realizado!",
          description: "Bem-vindo!",
        });
        
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: { name: name.trim() },
            emailRedirectTo: `${window.location.origin}`
          }
        });
        
        if (error) throw error;
        
        if (data.user && !data.user.email_confirmed_at) {
          if (onEmailVerification) {
            onEmailVerification();
          }
        }
        
        toast({
          title: "Conta criada!",
          description: "Verifique seu email para confirmar.",
        });
      }
    } catch (error: any) {
      console.error('Erro na autenticação:', error);
      
      let errorMessage = 'Erro na autenticação.';
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'Email já cadastrado. Tente fazer login.';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.message.includes('Password should be')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email?.trim()) {
      toast({
        title: "Email necessário",
        description: "Digite seu email.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado!",
        description: "Verifique seu email."
      });
      return true;
    } catch (error: any) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGoogleAuth,
    handleEmailAuth,
    handleForgotPassword,
    handleMagicLink
  };
};
