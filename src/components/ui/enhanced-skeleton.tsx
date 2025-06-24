
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

const EnhancedSkeleton = ({ 
  className, 
  variant = 'rectangular', 
  width, 
  height, 
  lines = 1,
  animate = true
}: SkeletonProps) => {
  const baseClasses = cn(
    "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
    animate && "animate-pulse bg-[length:200%_100%]"
  );
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
    rounded: "rounded-lg"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              index === lines - 1 && "w-3/4",
              className
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
      role="status"
      aria-label="Carregando conteúdo"
    />
  );
};

// Componentes especializados
const SkeletonCard = ({ className }: { className?: string }) => (
  <Card className={cn("border shadow-sm", className)}>
    <CardHeader className="space-y-3">
      <EnhancedSkeleton variant="text" className="w-3/4 h-6" />
      <EnhancedSkeleton variant="text" lines={2} className="h-4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <EnhancedSkeleton variant="rectangular" className="w-full h-32" />
      <div className="flex gap-3">
        <EnhancedSkeleton variant="rounded" className="flex-1 h-10" />
        <EnhancedSkeleton variant="rounded" className="flex-1 h-10" />
      </div>
    </CardContent>
  </Card>
);

const SkeletonList = ({ 
  items = 3, 
  className,
  showAvatar = true 
}: { 
  items?: number; 
  className?: string;
  showAvatar?: boolean;
}) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
        {showAvatar && (
          <EnhancedSkeleton variant="circular" width="3rem" height="3rem" />
        )}
        <div className="flex-1 space-y-3">
          <EnhancedSkeleton variant="text" className="w-1/2 h-5" />
          <EnhancedSkeleton variant="text" lines={2} className="h-4" />
          <div className="flex gap-2">
            <EnhancedSkeleton variant="rounded" className="w-16 h-6" />
            <EnhancedSkeleton variant="rounded" className="w-20 h-6" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SkeletonDashboard = ({ className }: { className?: string }) => (
  <div className={cn("space-y-6", className)}>
    {/* Header */}
    <div className="space-y-4">
      <EnhancedSkeleton variant="text" className="w-1/3 h-8" />
      <EnhancedSkeleton variant="text" lines={2} className="w-2/3 h-4" />
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <EnhancedSkeleton variant="circular" width="2.5rem" height="2.5rem" />
            <EnhancedSkeleton variant="text" className="w-12 h-4" />
          </div>
          <EnhancedSkeleton variant="text" className="w-full h-6" />
          <EnhancedSkeleton variant="text" className="w-3/4 h-4" />
        </Card>
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SkeletonCard />
      </div>
      <div className="space-y-4">
        <SkeletonList items={3} showAvatar={false} />
      </div>
    </div>
  </div>
);

const SkeletonProfile = ({ className }: { className?: string }) => (
  <div className={cn("max-w-2xl mx-auto space-y-6", className)}>
    {/* Profile Header */}
    <Card className="p-6">
      <div className="flex items-start gap-6">
        <EnhancedSkeleton variant="circular" width="5rem" height="5rem" />
        <div className="flex-1 space-y-4">
          <EnhancedSkeleton variant="text" className="w-1/2 h-6" />
          <EnhancedSkeleton variant="text" lines={2} className="h-4" />
          <div className="flex gap-3">
            <EnhancedSkeleton variant="rounded" className="w-24 h-8" />
            <EnhancedSkeleton variant="rounded" className="w-20 h-8" />
          </div>
        </div>
      </div>
    </Card>
    
    {/* Form Fields */}
    <Card className="p-6 space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <EnhancedSkeleton variant="text" className="w-24 h-4" />
          <EnhancedSkeleton variant="rounded" className="w-full h-10" />
        </div>
      ))}
    </Card>
  </div>
);

const SkeletonChat = ({ className }: { className?: string }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: 6 }).map((_, index) => {
      const isUser = index % 2 === 0;
      return (
        <div 
          key={index} 
          className={cn(
            "flex gap-3",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          {!isUser && (
            <EnhancedSkeleton variant="circular" width="2rem" height="2rem" />
          )}
          <div className={cn(
            "max-w-xs space-y-2",
            isUser ? "items-end" : "items-start"
          )}>
            <EnhancedSkeleton 
              variant="rounded" 
              className={cn(
                "h-12",
                isUser ? "w-40" : "w-48"
              )}
            />
            <EnhancedSkeleton variant="text" className="w-16 h-3" />
          </div>
          {isUser && (
            <EnhancedSkeleton variant="circular" width="2rem" height="2rem" />
          )}
        </div>
      );
    })}
  </div>
);

export { 
  EnhancedSkeleton, 
  SkeletonCard, 
  SkeletonList, 
  SkeletonDashboard,
  SkeletonProfile,
  SkeletonChat
};
