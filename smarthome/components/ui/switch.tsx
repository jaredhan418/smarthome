"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-[#dbdfe5] p-[3px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#6d6e72] focus-visible:ring-offset-2 data-[checked]:bg-[#282e37] disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-[18px] translate-x-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform data-[checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
