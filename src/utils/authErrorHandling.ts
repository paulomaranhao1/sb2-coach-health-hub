
import { AuthError } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const handleAuthError = (error: AuthError | Error | any): string => {
  console.error('🔐 Erro de autenticação:', error);
  
  if (!error) return 'Erro desconhecido';
  
  const message = error.message?.toLowerCase() || '';
  
  // Erros específicos do Supabase Auth
  if (message.includes('user not found') || message.includes('invalid login credentials')) {
    return 'Email ou senha incorretos';
  }
  
  if (message.includes('email not confirmed')) {
    return 'Por favor, confirme seu email antes de fazer login';
  }
  
  if (message.includes('user already registered')) {
    return 'Este email já está cadastrado. Tente fazer login';
  }
  
  if (message.includes('signup is disabled')) {
    return 'Cadastro temporariamente desabilitado';
  }
  
  if (message.includes('email rate limit exceeded')) {
    return 'Muitas tentativas. Tente novamente em alguns minutos';
  }
  
  if (message.includes('invalid email')) {
    return 'Email inválido';
  }
  
  if (message.includes('password')) {
    return 'Senha deve ter pelo menos 6 caracteres';
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'Erro de conexão. Verifique sua internet';
  }
  
  // Erro genérico
  return error.message || 'Erro na autenticação';
};

export const showAuthErrorToast = (error: any) => {
  const errorMessage = handleAuthError(error);
  toast.error(errorMessage, {
    duration: 5000,
    position: 'top-center'
  });
};

export const showAuthSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-center'
  });
};
