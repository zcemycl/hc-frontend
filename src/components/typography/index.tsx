"use client";
import { FC, ReactNode } from "react";

const TypographyH2: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <h2 className="text-white text-lg mb-1 font-medium title-font">
      {children}
    </h2>
  );
};

export { TypographyH2 };
