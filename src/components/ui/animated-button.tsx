
import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AnimatedButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  success?: boolean;
  successDuration?: number;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, loading, loadingText, success, successDuration = 2000, disabled, ...props }, ref) => {
    const [showSuccess, setShowSuccess] = React.useState(false);

    React.useEffect(() => {
      if (success) {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), successDuration);
        return () => clearTimeout(timer);
      }
    }, [success, successDuration]);

    return (
      <Button
        className={cn(
          "transition-all duration-300 transform hover:scale-105 active:scale-95",
          "hover:shadow-lg",
          showSuccess && "bg-green-600 hover:bg-green-700",
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {showSuccess ? (
          "✓ Sucesso!"
        ) : loading ? (
          loadingText || "Carregando..."
        ) : (
          children
        )}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
