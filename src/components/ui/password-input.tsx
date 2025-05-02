import * as React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative w-full">
      <Input
        type={show ? "text" : "password"}
        className={className + " pr-12"}
        autoComplete="current-password"
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C3A70] hover:text-[#FF9800] focus:outline-none"
      >
        <Image
          src={show ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
          alt={show ? "Hide password" : "Show password"}
          width={24}
          height={24}
        />
      </button>
    </div>
  );
} 