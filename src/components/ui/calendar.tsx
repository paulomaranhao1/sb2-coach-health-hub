import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Versão simplificada do Calendar sem react-day-picker
export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | Date[] | undefined) => void
  disabled?: (date: Date) => boolean
  fromYear?: number
  toYear?: number
  fromMonth?: Date
  toMonth?: Date
  defaultMonth?: Date
}

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="date"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...(props as any)}
          />
        </div>
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }