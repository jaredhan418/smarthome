import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#6d6e72] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#20242b] text-white shadow-sm hover:bg-[#2b3039]",
        secondary: "bg-[#e8ebf3] text-[#313234] hover:bg-[#dee2e8]",
        outline: "border border-[#dadee4] bg-white text-[#3c3d3f] hover:bg-[#eef1f9]",
        ghost: "text-[#636468] hover:bg-[#e8ebf3] hover:text-[#22262d]",
        lime: "bg-[#d8e9ff] text-[#18212c] hover:bg-[#c4dcf7]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 px-5",
        icon: "size-10 p-0",
        "icon-sm": "size-8 rounded-lg p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
