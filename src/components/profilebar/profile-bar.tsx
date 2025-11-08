import { BackBtn, TypographyH2 } from "@/components";
import React from "react";

export const ProfileBar = ({
  title,
  username,
  role,
  children,
  backCallBack,
}: {
  title?: string;
  username?: string;
  role?: string;
  children?: React.ReactNode;
  backCallBack?: () => void;
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between">
        <div
          className="flex 
                  flex-col
                  sm:flex-row sm:space-x-2"
        >
          {username && <TypographyH2>{username?.toUpperCase()}</TypographyH2>}
          {title && <TypographyH2>{title}</TypographyH2>}
          {role && (
            <span
              className="leading-relaxed mb-1 
                  bg-amber-400 rounded-lg py-1 px-2 text-black
                  font-bold w-fit"
            >
              {role}
            </span>
          )}
        </div>
        <BackBtn
          {...{
            customCallBack: backCallBack,
          }}
        />
      </div>
      {children}
    </div>
  );
};
