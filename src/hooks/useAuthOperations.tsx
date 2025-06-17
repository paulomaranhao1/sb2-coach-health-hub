
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
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro na autenticação",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleEmailAuth = async (
    email: string, 
    password: string, 
    name: string, 
    isLogin: boolean,
    onEmailVerification: () => void
  ) => {
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Tentando fazer login...');
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        console.log('Login realizado com sucesso');
      } else {
        console.log('Tentando criar nova conta...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            },
            emailRedirectTo: window.location.origin
          }
        });
        
        if (error) throw error;
        
        console.log('Conta criada, dados:', data);
        
        // Mostrar tela de verificação de email
        onEmailVerification();
        
        // Criar estatísticas do usuário após signup bem-sucedido
        if (data.user && data.user.email_confirmed_at) {
          console.log('Usuário criado, ID:', data.user.id);
          
          // Aguardar um pouco para garantir que o usuário está completamente criado
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
      }
      
      toast({
        title: "Erro na autenticação",
        description: errorMessage,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email para recuperar a senha.",
        variant: "destructive"
      });
      return;
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
      toast({
        title: "Erro ao enviar email",
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
    handleForgotPassword
  };
};
