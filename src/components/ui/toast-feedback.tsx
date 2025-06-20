
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
      className: "bg-green-50 border-green-200 text-green-900 font-medium dark:bg-green-900/20 dark:border-green-800 dark:text-green-100",
      ...options
    });
  },

  error: (message: string, options?: ToastFeedbackOptions) => {
    toast.error(message, {
      icon: <XCircle className="w-4 h-4" />,
      className: "bg-red-50 border-red-200 text-red-900 font-medium dark:bg-red-900/20 dark:border-red-800 dark:text-red-100",
      ...options
    });
  },

  warning: (message: string, options?: ToastFeedbackOptions) => {
    toast.warning(message, {
      icon: <AlertCircle className="w-4 h-4" />,
      className: "bg-orange-50 border-orange-200 text-orange-900 font-medium dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-100",
      ...options
    });
  },

  info: (message: string, options?: ToastFeedbackOptions) => {
    toast.info(message, {
      icon: <Info className="w-4 h-4" />,
      className: "bg-blue-50 border-blue-200 text-blue-900 font-medium dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
      ...options
    });
  }
};
