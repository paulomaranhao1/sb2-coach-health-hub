
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleAuth = async () => {
    console.log('useAuthOperations: Iniciando Google Auth...');
    setLoading(true);
    try {
      // Usar URL base limpa sem parâmetros do Lovable
      const baseUrl = window.location.origin;
      console.log('useAuthOperations: Redirect URL:', baseUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: baseUrl,
        }
      });
      
      if (error) {
        console.error('useAuthOperations: Erro Google Auth:', error);
        throw error;
      }
      
      console.log('useAuthOperations: Google Auth iniciado com sucesso');
      
    } catch (error: any) {
      console.error('useAuthOperations: Erro na autenticação Google:', error);
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

    console.log('useAuthOperations: Enviando Magic Link para:', email);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}`,
        }
      });
      
      if (error) throw error;
      
      console.log('useAuthOperations: Magic Link enviado com sucesso');
      toast({
        title: "Link enviado!",
        description: "Verifique seu email.",
      });
      return true;
    } catch (error: any) {
      console.error('useAuthOperations: Erro Magic Link:', error);
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
    console.log('useAuthOperations: Iniciando', isLogin ? 'login' : 'signup', 'com email:', email);
    
    // Validações simples
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
        console.log('useAuthOperations: Fazendo login...');
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });
        
        if (error) {
          console.error('useAuthOperations: Erro no login:', error);
          throw error;
        }
        
        console.log('useAuthOperations: Login realizado com sucesso');
        toast({
          title: "Login realizado!",
          description: "Bem-vindo!",
        });
        
      } else {
        console.log('useAuthOperations: Criando conta...');
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: { name: name.trim() },
            emailRedirectTo: `${window.location.origin}`
          }
        });
        
        if (error) {
          console.error('useAuthOperations: Erro no signup:', error);
          throw error;
        }
        
        console.log('useAuthOperations: Conta criada:', !!data.user);
        
        if (data.user && !data.user.email_confirmed_at) {
          console.log('useAuthOperations: Email não confirmado, mostrando tela de verificação');
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
      console.error('useAuthOperations: Erro na autenticação:', error);
      
      let errorMessage = 'Erro na autenticação.';
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'Email já cadastrado. Tente fazer login.';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login.';
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

    console.log('useAuthOperations: Enviando reset de senha para:', email);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      console.log('useAuthOperations: Reset de senha enviado');
      toast({
        title: "Email enviado!",
        description: "Verifique seu email."
      });
      return true;
    } catch (error: any) {
      console.error('useAuthOperations: Erro no reset:', error);
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
