"use client";
import { useState } from "react";

interface IToggleOptions {
  key: string;
  displayName: string;
  [key: string]: any;
}

export const ToggleBtnList = ({
  defaultSelectedKeys,
  toggleOptions,
  clickCallBack,
}: {
  defaultSelectedKeys: string[];
  toggleOptions: IToggleOptions[];
  clickCallBack: (key: string) => void;
}) => {
  return (
    <>
      {toggleOptions.map((pair: IToggleOptions) => {
        return (
          <button
            key={pair.key}
            onClick={(e) => {
              e.preventDefault();
              clickCallBack(pair.key);
            }}
            className={`p-2 rounded-lg text-black
                            font-bold
                            ${defaultSelectedKeys.includes(pair.key) ? "bg-amber-500 hover:bg-amber-300" : "bg-slate-300"}`}
          >
            {pair.displayName}
          </button>
        );
      })}
    </>
  );
};
