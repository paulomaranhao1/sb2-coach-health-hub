
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = ({ 
  className, 
  variant = 'rectangular', 
  width, 
  height, 
  lines = 1 
}: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-md"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              index === lines - 1 && "w-3/4", // Last line shorter
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

const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("p-6 space-y-4", className)}>
    <Skeleton variant="rectangular" height="1.5rem" className="w-3/4" />
    <Skeleton variant="text" lines={3} />
    <div className="flex gap-2 pt-2">
      <Skeleton variant="rectangular" height="2.5rem" width="5rem" />
      <Skeleton variant="rectangular" height="2.5rem" width="5rem" />
    </div>
  </div>
);

const SkeletonList = ({ items = 3, className }: { items?: number; className?: string }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center gap-4 p-4">
        <Skeleton variant="circular" width="3rem" height="3rem" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

export { Skeleton, SkeletonCard, SkeletonList };
