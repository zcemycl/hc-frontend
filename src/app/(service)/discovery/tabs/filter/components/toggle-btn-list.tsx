"use client";
import { VisibilityBtn } from "@/components";
import { switch_color_node, switch_hover_color_node } from "../../../utils";

interface IToggleOptions {
  key: string;
  displayName: string;
  [key: string]: any;
}

export const ToggleBtnList = ({
  visibility,
  defaultSelectedKeys,
  toggleOptions,
  clickCallBack,
  visibilityCallback,
}: {
  visibility: boolean[];
  defaultSelectedKeys: string[];
  toggleOptions: IToggleOptions[];
  clickCallBack: (key: string) => void;
  visibilityCallback: (idx: number, nodeTypeKey: string) => void;
}) => {
  return (
    <>
      {toggleOptions.map((pair: IToggleOptions, idx: number) => {
        return (
          <button
            key={pair.key}
            onClick={(e) => {
              e.preventDefault();
              clickCallBack(pair.key);
            }}
            className={`p-2 rounded-lg text-black
                font-bold flex flex-row space-x-2
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
            <span>{pair.displayName}</span>
            <button
              className={`
              px-1 rounded-lg shadow-md
              ${
                visibility[idx]
                  ? "bg-teal-700 hover:bg-teal-300"
                  : "bg-teal-300 hover:bg-teal-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                visibilityCallback(idx, pair.key);
              }}
            >
              <VisibilityBtn
                {...{
                  isHidden: visibility[idx],
                  isShowText: false,
                }}
              />
            </button>
          </button>
        );
      })}
    </>
  );
};
