import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1B4332] text-white shadow hover:bg-[#1B4332]/85",
        secondary:
          "border-transparent bg-[#52796F] text-white hover:bg-[#52796F]/80",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-500/80",
        outline: "text-stone-900 border-stone-200",
        success:
          "border-transparent bg-[#c1ecd4] text-[#1B4332] font-bold",
        warning:
          "border-transparent bg-amber-100 text-amber-800 font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
