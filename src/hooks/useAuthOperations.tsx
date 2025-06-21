
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createUserStats = async (userId: string) => {
    try {
      console.log('Criando estatísticas para usuário:', userId);
      
      const { data, error } = await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          points: 0,
          level: 1,
          shields: [],
          stickers: [],
          streak: 0
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar estatísticas do usuário:', error);
        throw error;
      }
      
      console.log('Estatísticas criadas com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro na função createUserStats:', error);
      throw error;
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Redirecionando...",
        description: "Você será redirecionado para fazer login com Google.",
      });
    } catch (error: any) {
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
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email para receber o link mágico.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}`,
          data: {
            auth_method: 'magic_link'
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Link mágico enviado!",
        description: "Verifique seu email e clique no link para entrar.",
      });
      return true;
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid email')) {
        errorMessage = 'Email inválido. Verifique o formato.';
      } else if (error.message.includes('Email rate limit exceeded')) {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
      }
      
      toast({
        title: "Erro ao enviar link mágico",
        description: errorMessage,
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
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && !name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, preencha seu nome para criar a conta.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        console.log('Tentando fazer login...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        console.log('Login realizado com sucesso:', data);
        
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta ao SB2coach.ai!",
        });
        
      } else {
        console.log('Tentando criar nova conta...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              auth_method: 'email_password'
            },
            emailRedirectTo: `${window.location.origin}`
          }
        });
        
        if (error) throw error;
        
        console.log('Conta criada, dados:', data);
        
        if (data.user && !data.user.email_confirmed_at) {
          // Mostrar tela de verificação de email se necessário
          if (onEmailVerification) {
            onEmailVerification();
          }
          
          toast({
            title: "Conta criada!",
            description: "Verifique seu email para confirmar sua conta.",
          });
        } else {
          toast({
            title: "Conta criada!",
            description: "Bem-vindo ao SB2coach.ai!",
          });
        }
        
        // Criar estatísticas do usuário se confirmado
        if (data.user && data.user.email_confirmed_at) {
          console.log('Usuário criado e confirmado, ID:', data.user.id);
          
          setTimeout(async () => {
            try {
              await createUserStats(data.user.id);
            } catch (statsError) {
              console.error('Erro ao criar estatísticas:', statsError);
            }
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error('Erro na autenticação:', error);
      let errorMessage = error.message;
      
      // Traduzir erros comuns para português
      if (error.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.message.includes('Password should be')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Email inválido. Verifique o formato.';
      } else if (error.message.includes('weak password')) {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
      } else if (error.message.includes('Email rate limit exceeded')) {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
      } else if (error.message.includes('signup disabled')) {
        errorMessage = 'Cadastro desabilitado. Entre em contato com o suporte.';
      }
      
      toast({
        title: "Erro na autenticação",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email para recuperar a senha.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado!",
        description: "Verifique seu email para redefinir sua senha."
      });
      return true;
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (error.message.includes('Email rate limit exceeded')) {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
      }
      
      toast({
        title: "Erro ao enviar email",
        description: errorMessage,
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
