
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

interface ToastFeedbackOptions {
  title?: string;
  description?: string;
}

export const toastFeedback = {
  success: (message: string, options?: ToastFeedbackOptions) => {
    toast.success(message, {
      icon: <CheckCircle className="w-4 h-4" />,
      className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
      ...options
    });
  },

  error: (message: string, options?: ToastFeedbackOptions) => {
    toast.error(message, {
      icon: <XCircle className="w-4 h-4" />,
      className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
      ...options
    });
  },

  warning: (message: string, options?: ToastFeedbackOptions) => {
    toast.warning(message, {
      icon: <AlertCircle className="w-4 h-4" />,
      className: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
      ...options
    });
  },

  info: (message: string, options?: ToastFeedbackOptions) => {
    toast.info(message, {
      icon: <Info className="w-4 h-4" />,
      className: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
      ...options
    });
  }
};
