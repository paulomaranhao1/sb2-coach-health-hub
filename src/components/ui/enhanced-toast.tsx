
import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface EnhancedToastOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export const enhancedToast = {
  success: (message: string, options?: EnhancedToastOptions) => {
    sonnerToast.success(message, {
      icon: <CheckCircle className="w-4 h-4" />,
      description: options?.description,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined,
      duration: options?.duration || 4000,
      className: "bg-green-50 border-green-200 text-green-900 dark:bg-green-900 dark:border-green-800 dark:text-green-100 !bg-opacity-100 !backdrop-blur-none",
    });
  },

  error: (message: string, options?: EnhancedToastOptions) => {
    sonnerToast.error(message, {
      icon: <XCircle className="w-4 h-4" />,
      description: options?.description,
      duration: options?.duration || 6000,
      className: "bg-red-50 border-red-200 text-red-900 dark:bg-red-900 dark:border-red-800 dark:text-red-100 !bg-opacity-100 !backdrop-blur-none",
    });
  },

  warning: (message: string, options?: EnhancedToastOptions) => {
    sonnerToast.warning(message, {
      icon: <AlertCircle className="w-4 h-4" />,
      description: options?.description,
      duration: options?.duration || 5000,
      className: "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-900 dark:border-orange-800 dark:text-orange-100 !bg-opacity-100 !backdrop-blur-none",
    });
  },

  info: (message: string, options?: EnhancedToastOptions) => {
    sonnerToast.info(message, {
      icon: <Info className="w-4 h-4" />,
      description: options?.description,
      duration: options?.duration || 4000,
      className: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-100 !bg-opacity-100 !backdrop-blur-none",
    });
  },

  loading: (message: string, options?: EnhancedToastOptions) => {
    return sonnerToast.loading(message, {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      description: options?.description,
      className: "bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 !bg-opacity-100 !backdrop-blur-none",
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });
  }
};
