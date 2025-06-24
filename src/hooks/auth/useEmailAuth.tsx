
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEmailAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (
    email: string, 
    password: string, 
    name: string, 
    isLogin: boolean,
    onEmailVerification?: () => void
  ) => {
    console.log('useEmailAuth: Email auth -', isLogin ? 'login' : 'signup');
    
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
        
        console.log('useEmailAuth: Login realizado');
        
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
        
        toast({
          title: "Conta criada!",
          description: "Verifique seu email para confirmar.",
        });
      }
    } catch (error: any) {
      console.error('useEmailAuth: Erro na autenticação:', error);
      
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
      setLoading(false);
    }
  };

  return {
    loading,
    handleEmailAuth
  };
};
