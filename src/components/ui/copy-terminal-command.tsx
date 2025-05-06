"use client";

import * as React from "react";
import Image from "next/image";

const COMMAND = "npx degit hamza3256/nimbus-auth my-app";

export function CopyTerminalCommand() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 rounded-xl border-2 border-[#1C3A70] shadow-lg bg-white/95">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1C3A70] rounded-t-xl">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/terminal.svg"
            alt="Terminal"
            width={16}
            height={16}
            className="opacity-90 invert"
          />
          <span className="font-mono text-xs text-white font-semibold tracking-wide">
            Terminal
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="rounded-md bg-transparent hover:bg-[#FF9800]/20 transition-colors focus:outline-none border border-transparent flex items-center justify-center"
          aria-label={copied ? "Copied!" : "Copy command"}
          type="button"
        >
          <Image
            src={copied ? "/icons/copied.svg" : "/icons/copy-icon.svg"}
            alt={copied ? "Copied!" : "Copy command"}
            width={20}
            height={20}
            className={`${copied ? "filter-orange" : "filter-blue"}`}
          />
        </button>
      </div>
      {/* Command Area */}
      <div className="px-4 py-3 bg-[#FF9800] text-white font-mono font-semibold rounded-b-xl overflow-x-auto shadow-[0_2px_8px_0_rgba(28,58,112,0.10)]">
        <code className="whitespace-nowrap select-all text-base">
          {COMMAND}
        </code>
      </div>
    </div>
  );
}

/*
Add the following to your global CSS for icon color filters:
.filter-blue { filter: invert(19%) sepia(97%) saturate(749%) hue-rotate(186deg) brightness(92%) contrast(101%); }
.filter-orange { filter: invert(69%) sepia(97%) saturate(749%) hue-rotate(359deg) brightness(101%) contrast(101%); }
*/
