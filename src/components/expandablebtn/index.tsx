"use client";
import { FC, ReactNode } from "react";

const ExpandableBtn: FC<{
  children: ReactNode;
  childrenLong: ReactNode;
  hoverCondition: boolean;
  refkey: string;
  onMouseOver?: (e: React.MouseEvent<HTMLElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({ children, childrenLong, hoverCondition, refkey, ...props }) => {
  return (
    <div
      className="sm:w-1/2 flex flex-col
            w-screen space-y-2 mb-2 h-auto overflow-hidden"
      key={refkey}
    >
      <button
        className={`
            rounded text-white border-blue-400
            border-2 hover:border-blue-800 h-auto
            p-2 focus:animate-pulse
            hover:bg-blue-800 transition`}
        {...props}
      >
        <div className="flex justify-between">{children}</div>
        <div
          className={`leading-relaxed transition origin-top
                ${hoverCondition ? "max-h-full scale-y-100" : "max-h-0 scale-y-0"}`}
        >
          {childrenLong}
        </div>
      </button>
    </div>
  );
};

export { ExpandableBtn };
