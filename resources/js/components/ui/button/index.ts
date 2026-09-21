import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium cursor-pointer transition-colors motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-foreground text-background shadow-xs hover:brightness-95",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-xs hover:brightness-95",
        outline:
          "border border-border bg-card/60 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-accent-foreground underline-offset-4 hover:underline",
      },
      size: {
        "default": "h-10 px-4 py-2 has-[>svg]:px-3",
        "sm": "h-9 gap-1.5 px-3 has-[>svg]:px-2.5",
        "lg": "h-11 px-6 has-[>svg]:px-4",
        "icon": "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
