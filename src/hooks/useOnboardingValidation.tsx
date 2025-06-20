
import { useState } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  message: string;
}

interface ValidationSchema {
  [key: string]: ValidationRule[];
}

export const useOnboardingValidation = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validationSchema: ValidationSchema = {
    name: [
      { required: true, message: "Nome é obrigatório" },
      { minLength: 2, message: "Nome deve ter pelo menos 2 caracteres" },
      { maxLength: 50, message: "Nome deve ter no máximo 50 caracteres" }
    ],
    gender: [
      { required: true, message: "Selecione um gênero" }
    ],
    weight: [
      { required: true, message: "Peso é obrigatório" },
      { min: 30, message: "Peso deve ser pelo menos 30kg" },
      { max: 300, message: "Peso deve ser no máximo 300kg" }
    ],
    height: [
      { required: true, message: "Altura é obrigatória" },
      { min: 100, message: "Altura deve ser pelo menos 100cm" },
      { max: 250, message: "Altura deve ser no máximo 250cm" }
    ],
    age: [
      { required: true, message: "Idade é obrigatória" },
      { min: 13, message: "Idade deve ser pelo menos 13 anos" },
      { max: 120, message: "Idade deve ser no máximo 120 anos" }
    ],
    goalWeight: [
      { required: true, message: "Meta de peso é obrigatória" },
      { min: 30, message: "Meta deve ser pelo menos 30kg" },
      { max: 300, message: "Meta deve ser no máximo 300kg" }
    ],
    phoneNumber: [
      { required: true, message: "Telefone é obrigatório" },
      { pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: "Use o formato (11) 99999-9999" }
    ]
  };

  const validateField = (name: string, value: any): boolean => {
    const rules = validationSchema[name];
    if (!rules) return true;

    for (const rule of rules) {
      if (rule.required && (!value || value.toString().trim() === '')) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }

      if (rule.minLength && value.toString().length < rule.minLength) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }

      if (rule.maxLength && value.toString().length > rule.maxLength) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }

      if (rule.pattern && !rule.pattern.test(value.toString())) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }

      if (rule.min && parseFloat(value) < rule.min) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }

      if (rule.max && parseFloat(value) > rule.max) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return true;
  };

  return { errors, validateField };
};
