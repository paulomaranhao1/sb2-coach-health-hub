
import { cn } from "@/lib/utils";
import { Loader2, Zap, Heart, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'pulse' | 'bounce' | 'spin';
  text?: string;
  className?: string;
  showIcon?: boolean;
}

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'spin', 
  text, 
  className, 
  showIcon = true 
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const animationClasses = {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    default: 'animate-spin'
  };

  const icons = {
    spin: Loader2,
    pulse: Heart,
    bounce: Zap,
    default: Target
  };

  const Icon = icons[variant] || icons.default;

  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      {showIcon && (
        <Icon 
          className={cn(
            "text-red-500", 
            sizeClasses[size],
            animationClasses[variant]
          )} 
        />
      )}
      {text && (
        <span className={cn(
          "font-medium text-muted-foreground",
          size === 'sm' && 'text-sm',
          size === 'lg' && 'text-lg',
          size === 'xl' && 'text-xl'
        )}>
          {text}
        </span>
      )}
    </div>
  );
};

export const LoadingCard = ({ 
  text = "Carregando...", 
  variant = 'pulse',
  className 
}: LoadingStateProps) => (
  <Card className={cn("animate-pulse", className)}>
    <CardContent className="p-6">
      <LoadingSpinner 
        size="md" 
        variant={variant} 
        text={text}
        className="py-8"
      />
    </CardContent>
  </Card>
);

export const LoadingOverlay = ({ 
  text = "Carregando...", 
  size = 'lg' 
}: LoadingStateProps) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
    <div className="bg-background/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl border max-w-sm w-full mx-4">
      <LoadingSpinner 
        size={size} 
        variant="spin" 
        text={text}
        className="text-center"
      />
    </div>
  </div>
);

export const LoadingButton = ({ 
  text = "Processando...", 
  size = 'sm' 
}: LoadingStateProps) => (
  <div className="flex items-center justify-center gap-2 px-4 py-2">
    <LoadingSpinner size={size} showIcon={true} />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export const LoadingPage = ({ 
  text = "Carregando aplicação...", 
  size = 'xl' 
}: LoadingStateProps) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-6 max-w-md">
      <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
        <Heart className="w-8 h-8 text-white animate-pulse" />
      </div>
      <LoadingSpinner 
        size={size} 
        variant="spin" 
        text={text}
        showIcon={false}
        className="text-center"
      />
      <p className="text-sm text-muted-foreground">
        SB2coach.ai está preparando tudo para você
      </p>
    </div>
  </div>
);

export const LoadingSection = ({ 
  text = "Carregando seção...", 
  className 
}: LoadingStateProps) => (
  <div className={cn("py-12 px-6 text-center", className)}>
    <LoadingSpinner 
      size="lg" 
      variant="pulse" 
      text={text}
    />
  </div>
);

export default LoadingSpinner;
