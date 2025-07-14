"use client";
import { FC, ReactNode } from "react";

const TypographyH2: FC<{
  children: ReactNode;
  extraClass?: string;
}> = ({ children, extraClass }) => {
  return (
    <h2
      className={`
      text-lg mb-1 font-medium
      align-middle content-center
      text-wrap
      title-font
      ${extraClass ? extraClass : "text-white"}`}
    >
      {children}
    </h2>
  );
};

export { TypographyH2 };
