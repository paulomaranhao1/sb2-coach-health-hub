import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";
interface AnimatedButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  success?: boolean;
  successDuration?: number;
}
export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(({
  className,
  children,
  loading,
  loadingText,
  success,
  successDuration = 2000,
  disabled,
  ...props
}, ref) => {
  const [showSuccess, setShowSuccess] = React.useState(false);
  React.useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), successDuration);
      return () => clearTimeout(timer);
    }
  }, [success, successDuration]);
  return <Button className={cn("relative overflow-hidden transition-all duration-300", "hover:shadow-button-hover active:scale-95", "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100", showSuccess && "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700", loading && "animate-pulse", className)} disabled={disabled || loading} ref={ref} {...props}>
        <div className="relative z-10 flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {showSuccess && !loading && <Check className="w-4 h-4 animate-bounce-subtle" />}
          <span className="font-normal text-slate-950">
            {showSuccess ? "✓ Sucesso!" : loading ? loadingText || "Carregando..." : children}
          </span>
        </div>
      </Button>;
});
AnimatedButton.displayName = "AnimatedButton";