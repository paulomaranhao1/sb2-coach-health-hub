
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: "Senha deve ter pelo menos 6 caracteres" };
  }
  return { isValid: true };
};

export const validateWeight = (weight: number): { isValid: boolean; message?: string } => {
  if (weight <= 0 || weight > 500) {
    return { isValid: false, message: "Peso deve estar entre 1kg e 500kg" };
  }
  return { isValid: true };
};

export const validateHeight = (height: number): { isValid: boolean; message?: string } => {
  if (height <= 0 || height > 300) {
    return { isValid: false, message: "Altura deve estar entre 1cm e 300cm" };
  }
  return { isValid: true };
};

export const validateAge = (age: number): { isValid: boolean; message?: string } => {
  if (age < 13 || age > 120) {
    return { isValid: false, message: "Idade deve estar entre 13 e 120 anos" };
  }
  return { isValid: true };
};
