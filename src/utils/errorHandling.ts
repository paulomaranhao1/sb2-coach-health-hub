
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  
  if (error?.message) {
    // Traduzir erros comuns do Supabase
    const message = error.message.toLowerCase();
    
    if (message.includes('user already registered')) {
      return 'Este email já está cadastrado. Tente fazer login.';
    }
    
    if (message.includes('invalid login credentials')) {
      return 'Email ou senha incorretos.';
    }
    
    if (message.includes('email not confirmed')) {
      return 'Por favor, confirme seu email antes de fazer login.';
    }
    
    if (message.includes('invalid email')) {
      return 'Email inválido.';
    }
    
    if (message.includes('password')) {
      return 'Senha deve ter pelo menos 6 caracteres.';
    }
    
    if (message.includes('network')) {
      return 'Erro de conexão. Verifique sua internet.';
    }
    
    return error.message;
  }
  
  return 'Ocorreu um erro inesperado.';
};

export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  errorCallback?: (error: any) => void
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    console.error('Async operation failed:', error);
    if (errorCallback) {
      errorCallback(error);
    }
    return null;
  }
};
