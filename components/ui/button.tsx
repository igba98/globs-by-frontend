import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = "button"
    
    let baseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    
    let variantClass = ""
    if (variant === "default") variantClass = "bg-primary text-primary-foreground shadow hover:bg-primary/90"
    else if (variant === "destructive") variantClass = "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
    else if (variant === "outline") variantClass = "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
    else if (variant === "secondary") variantClass = "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
    else if (variant === "ghost") variantClass = "hover:bg-accent hover:text-accent-foreground"
    else if (variant === "link") variantClass = "text-primary underline-offset-4 hover:underline"

    let sizeClass = ""
    if (size === "default") sizeClass = "h-9 px-4 py-2"
    else if (size === "sm") sizeClass = "h-8 rounded-md px-3 text-xs"
    else if (size === "lg") sizeClass = "h-10 rounded-md px-8"
    else if (size === "icon") sizeClass = "h-9 w-9"

    return (
      <Comp
        className={cn(baseClass, variantClass, sizeClass, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
