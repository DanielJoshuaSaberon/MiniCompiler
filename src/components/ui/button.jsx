import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        main: "appearance-none bg-primary rounded-[15px] box-border text-white cursor-pointer text-[16px] font-semibold leading-normal px-6 py-4 text-center transition-all duration-300 ease-[cubic-bezier(.23,1,.32,1)] touch-manipulation w-[200px] hover:shadow-[0_8px_15px_rgba(60,187,177,0.30)] hover:-translate-y-2 active:shadow-none active:translate-y-0",
        destructive: "appearance-none bg-red-600 box-border text-white cursor-pointer text-[16px] font-semibold leading-normal px-6 py-4 text-center transition-all duration-300 ease-[cubic-bezier(.23,1,.32,1)] touch-manipulation w-[200px] hover:shadow-[0_8px_15px_rgba(220,38,38,0.30)] hover:-translate-y-2 active:shadow-none active:translate-y-0",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        main: "h-11 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "main",
      size: "main",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
