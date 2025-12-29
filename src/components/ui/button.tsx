import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-ios text-callout font-semibold ring-offset-background transition-all duration-200 ease-ios focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 press-scale min-h-touch",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow-ios hover:shadow-primary-glow dark:shadow-ios-sm",
                secondary: "glass-card text-foreground hover:glass-elevated",
                destructive: "bg-destructive text-destructive-foreground shadow-ios hover:shadow-destructive-glow",
                outline: "border-2 border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground",
                ghost: "hover:bg-accent/10 hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2.5",
                sm: "h-9 rounded-ios-sm px-4 text-subheadline",
                lg: "h-12 rounded-ios-md px-8 text-body",
                icon: "h-11 w-11",
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

