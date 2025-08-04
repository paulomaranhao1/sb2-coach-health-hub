"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Versão simplificada de Chart sem recharts - usa o LightweightChart existente
export interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: Record<string, string>
  }
}

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ComponentProps<"div">["children"]
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, children, config, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <div className="w-full">
          {children}
        </div>
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-background p-2 shadow-md",
        className
      )}
      {...props}
    />
  )
})
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
}