
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePasswordAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Link enviado!",
        description: "Verifique seu email.",
      });
      return true;
    } catch (error: any) {
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
    handleMagicLink,
    handleForgotPassword
  };
};
