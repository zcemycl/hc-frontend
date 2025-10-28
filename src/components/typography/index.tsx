"use client";
import { FC, ReactNode } from "react";

const TypographyH2: FC<{
  children: ReactNode;
  extraClass?: string;
}> = ({ children, extraClass }) => {
  return (
    <h2
      className={`
      text-lg font-medium
      align-middle content-center
      text-wrap text-center
      title-font
      ${extraClass ? extraClass : "text-white"}`}
    >
      {children}
    </h2>
  );
};

export { TypographyH2 };
