import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-ios px-4 py-2.5 text-callout",
                    "glass-subtle text-foreground placeholder:text-muted-foreground",
                    "transition-all duration-200 ease-ios",
                    "border-2 border-transparent",
                    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
                    "disabled:cursor-not-allowed disabled:opacity-40",
                    "min-h-touch",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }

