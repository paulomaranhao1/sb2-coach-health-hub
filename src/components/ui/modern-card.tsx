
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border transition-all duration-200",
          {
            'bg-white border-slate-200 shadow-sm hover:shadow-md': variant === 'default',
            'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/50 shadow-sm': variant === 'gradient',
            'bg-white/80 backdrop-blur-sm border-white/20 shadow-lg': variant === 'glass',
            'bg-white border-2 border-slate-300 hover:border-blue-300': variant === 'outlined',
          },
          {
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
ModernCard.displayName = "ModernCard";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  iconColor?: string;
  badge?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon: Icon, iconColor = "text-blue-600", badge, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between mb-4", className)}
      {...props}
    >
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className={cn("p-2 rounded-lg bg-slate-100", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {children}
      </div>
      {badge && (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          {badge}
        </span>
      )}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-bold text-slate-900 leading-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-slate-600 font-medium", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between pt-4 mt-4 border-t border-slate-100", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { ModernCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
