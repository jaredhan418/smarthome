import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full bg-[#e9ecf4] px-2.5 py-1 text-[11px] font-medium text-[#5b5d5f]", className)}
      {...props}
    />
  );
}

export { Badge };
