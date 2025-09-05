"use client";
import { switch_color_node, switch_hover_color_node } from "../../utils";

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
                ${
                  defaultSelectedKeys.includes(pair.key)
                    ? switch_color_node(pair.key) +
                      " " +
                      switch_hover_color_node(pair.key) +
                      " " +
                      "shadow-black shadow-md"
                    : "bg-slate-300 hover:shadow-md hover:shadow-black"
                }`}
          >
            {pair.displayName}
          </button>
        );
      })}
    </>
  );
};
