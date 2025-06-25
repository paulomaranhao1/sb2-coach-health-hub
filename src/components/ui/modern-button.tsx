
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

const modernButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700",
        secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
        success: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700",
        warning: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg hover:from-amber-600 hover:to-amber-700",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        link: "text-blue-600 underline-offset-4 hover:underline font-medium",
        gradient: "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-purple-600 hover:to-blue-700",
        glass: "bg-white/80 backdrop-blur-sm text-slate-700 border border-white/20 shadow-lg hover:bg-white/90",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      rounded: "default",
    },
  }
);

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modernButtonVariants> {
  asChild?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant, size, rounded, asChild = false, icon: Icon, iconPosition = 'left', loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(modernButtonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {Icon && iconPosition === 'left' && !loading && <Icon className="w-4 h-4" />}
        {children}
        {Icon && iconPosition === 'right' && !loading && <Icon className="w-4 h-4" />}
      </Comp>
    );
  }
);
ModernButton.displayName = "ModernButton";

export { ModernButton, modernButtonVariants };
