
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-button hover:shadow-button-hover hover:from-blue-600 hover:to-blue-700",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-medium hover:shadow-strong",
        outline: "border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400",
        secondary: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-700",
        link: "text-blue-500 underline-offset-4 hover:underline hover:text-blue-600",
        success: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-medium hover:from-green-600 hover:to-green-700",
        warning: "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900 shadow-medium hover:from-gray-500 hover:to-gray-600",
        info: "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-medium hover:from-blue-500 hover:to-blue-600",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
