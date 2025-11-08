"use client";

import { IToggleOptions } from "@/types";

const SmallTabBar = ({
  tabName,
  setTabName,
  options,
}: {
  tabName: string;
  setTabName: (s: string) => void;
  options: IToggleOptions[];
}) => {
  return (
    <div
      id="tab-bar-bundle-annotation"
      className="rounded-full p-1 bg-gray-400
                    flex flex-row gap-2"
    >
      {options.map((topt) => {
        return (
          <button
            key={topt.key}
            className={`rounded-full
                text-black basis-full
                px-1
                ${
                  topt.key === tabName
                    ? "bg-white font-semibold"
                    : "bg-gray-400"
                }`}
            onClick={(e) => {
              e.preventDefault();
              setTabName(topt.key);
            }}
          >
            {topt.displayName}
          </button>
        );
      })}
    </div>
  );
};

export { SmallTabBar };
