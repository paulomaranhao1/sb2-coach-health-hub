
import { useState } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
  message: string;
}

interface ValidationSchema {
  [key: string]: ValidationRule[];
}

export const useFormValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: any): boolean => {
    const rules = schema[name];
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

      if (rule.custom && !rule.custom(value)) {
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

  const validateAll = (data: { [key: string]: any }): boolean => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    Object.keys(schema).forEach(fieldName => {
      const fieldValid = validateField(fieldName, data[fieldName]);
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    validateField,
    validateAll,
    clearErrors
  };
};
