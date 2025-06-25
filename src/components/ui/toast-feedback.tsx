
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
      className: "bg-green-50 border-green-200 text-green-900 font-medium !bg-opacity-100 !backdrop-blur-none",
      ...options
    });
  },

  error: (message: string, options?: ToastFeedbackOptions) => {
    toast.error(message, {
      icon: <XCircle className="w-4 h-4" />,
      className: "bg-red-50 border-red-200 text-red-900 font-medium !bg-opacity-100 !backdrop-blur-none",
      ...options
    });
  },

  warning: (message: string, options?: ToastFeedbackOptions) => {
    toast.warning(message, {
      icon: <AlertCircle className="w-4 h-4" />,
      className: "bg-gray-50 border-gray-300 text-gray-900 font-medium !bg-opacity-100 !backdrop-blur-none",
      ...options
    });
  },

  info: (message: string, options?: ToastFeedbackOptions) => {
    toast.info(message, {
      icon: <Info className="w-4 h-4" />,
      className: "bg-blue-50 border-blue-200 text-blue-900 font-medium !bg-opacity-100 !backdrop-blur-none",
      ...options
    });
  }
};
