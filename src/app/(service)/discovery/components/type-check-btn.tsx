import { VisibilityBtn } from "@/components";
import { switch_color_node, switch_hover_color_node } from "../utils";
import { IToggleOptions, IVisibilityMap } from "@/types";

export const TypeCheckBtn = ({
  pair,
  visibility,
  isActiveFunc,
  clickCallBack,
  visibilityCallback,
}: {
  pair: IToggleOptions;
  visibility: IVisibilityMap;
  isActiveFunc: (i: string) => boolean;
  clickCallBack: (i: string) => void;
  visibilityCallback: (s: string) => void;
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        clickCallBack(pair.key);
      }}
      className={`p-2 rounded-lg text-black
                font-bold flex flex-row space-x-2
                ${
                  isActiveFunc(pair.key)
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
                visibility[pair.key]
                  ? "bg-teal-700 hover:bg-teal-300"
                  : "bg-teal-300 hover:bg-teal-700"
              }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          visibilityCallback(pair.key);
        }}
      >
        <VisibilityBtn
          {...{
            isHidden: visibility[pair.key],
            isShowText: false,
          }}
        />
      </button>
    </button>
  );
};
