"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-extrabold uppercase tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-yellow-400 focus-visible:ring-yellow-300/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF9800] text-white border-4 border-[#1C3A70] shadow-lg hover:bg-[#FFD600] hover:text-[#1C3A70] hover:scale-105 hover:shadow-yellow-400/60 focus-visible:ring-2 focus-visible:ring-[#FFD600]",
        destructive:
          "bg-destructive text-white border-4 border-black shadow-lg hover:bg-destructive/90 hover:scale-105 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-4 border-[#FF9800] text-[#FF9800] bg-white shadow-lg hover:bg-[#FFF3E0] hover:text-[#F57C00] hover:scale-105 hover:shadow-yellow-400/40",
        secondary:
          "bg-[#1C3A70] text-white border-4 border-[#FFD600] shadow-lg hover:bg-[#FFD600] hover:text-[#1C3A70] hover:scale-105 hover:shadow-blue-400/40",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-[#FF9800] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
