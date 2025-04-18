"use client";

import { GraphTabEnum } from "@/constants";
import { DiscoveryContext } from "@/contexts";
import { useContext } from "react";

export default function BundleTab() {
  const { tab } = useContext(DiscoveryContext);
  return (
    <div
      className={`absolute
                       left-0 right-0 top-0 bottom-0
                       self-end
                       space-y-2
                       overflow-y-auto
                       w-full h-full
                       transition
                       p-5
                       ${
                         tab === GraphTabEnum.bundle
                           ? "opacity-100 z-10 delay-200"
                           : "opacity-0 z-0 duration-200"
                       }
                       `}
    >
      <h2 className="leading text-slate-300 font-bold">Bundles</h2>
    </div>
  );
}
