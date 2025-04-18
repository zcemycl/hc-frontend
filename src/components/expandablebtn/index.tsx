"use client";
import { FC, ReactNode } from "react";

const ExpandableBtn: FC<{
  children: ReactNode;
  childrenLong: ReactNode;
  // hoverCondition: boolean;
  refkey: string;
  // onMouseOver?: (e: React.MouseEvent<HTMLElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({ children, childrenLong, refkey, ...props }) => {
  return (
    <div
      className="flex flex-col w-full 
        space-y-2 mb-2 h-auto overflow-hidden"
      key={refkey}
    >
      <button
        className={`group
            rounded text-white border-blue-400
            border-2 hover:border-blue-800 h-auto
            p-2 focus:animate-pulse
            hover:bg-blue-800 transition`}
        {...props}
      >
        <div className="flex justify-between">{children}</div>
        <div
          className={`leading-relaxed transition-all origin-top
            ease-in-out duration-300
            overflow-hidden
            max-h-0
            group-hover:max-h-full
              `}
        >
          {childrenLong}
        </div>
      </button>
    </div>
  );
};

export { ExpandableBtn };
