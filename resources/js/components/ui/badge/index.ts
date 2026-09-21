import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Badge } from "./Badge.vue"

// Compact status labels retain paired semantic foreground and background tokens.
export const badgeVariants = cva(
  "inline-flex items-center justify-center w-fit shrink-0 whitespace-nowrap rounded-full border border-transparent px-2 py-0.5 text-[11px] font-medium tracking-wide gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-destructive-foreground [a&]:hover:brightness-95 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        success:
          "bg-success text-success-foreground [a&]:hover:brightness-95",
        warning:
          "bg-warning text-warning-foreground [a&]:hover:brightness-95",
        outline:
          "bg-card text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
