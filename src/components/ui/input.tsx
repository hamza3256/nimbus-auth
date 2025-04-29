import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#1C3A70]/60 selection:bg-[#FFD600] selection:text-[#1C3A70] border-2 border-[#1C3A70] flex h-11 w-full min-w-0 rounded-lg bg-white/80 px-4 py-2 text-base font-bold shadow focus-visible:border-[#FFD600] focus-visible:ring-2 focus-visible:ring-[#FFD600]/60 transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
