import { BackBtn, TypographyH2 } from "@/components";
import React from "react";

export default function ProfileBar({
  username,
  role,
  children,
}: {
  username: string;
  role: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between">
        <div
          className="flex 
                  flex-col
                  sm:flex-row sm:space-x-2"
        >
          <TypographyH2>{username?.toUpperCase()}</TypographyH2>
          <span
            className="leading-relaxed mb-1 
                  bg-amber-400 rounded-lg py-1 px-2 text-black
                  font-bold w-fit"
          >
            {role}
          </span>
        </div>
        <BackBtn />
      </div>
      {children}
    </div>
  );
}
