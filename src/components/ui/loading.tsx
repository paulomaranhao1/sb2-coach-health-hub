
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loading = ({ size = 'md', text, className }: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Loader2 className={cn("animate-spin text-red-500", sizeClasses[size])} />
      {text && (
        <span className="text-sm text-muted-foreground animate-pulse">{text}</span>
      )}
    </div>
  );
};

export const LoadingOverlay = ({ text = "Carregando..." }: { text?: string }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-background/90 backdrop-blur-sm rounded-xl p-6 shadow-2xl border animate-scale-in">
        <Loading size="lg" text={text} />
      </div>
    </div>
  );
};

export const LoadingCard = ({ text = "Carregando dados..." }: { text?: string }) => {
  return (
    <div className="w-full h-32 bg-card/50 backdrop-blur-sm rounded-lg border border-dashed border-muted-foreground/25 flex items-center justify-center animate-pulse">
      <Loading text={text} />
    </div>
  );
};
