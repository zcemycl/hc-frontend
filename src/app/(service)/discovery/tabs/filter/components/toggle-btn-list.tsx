"use client";
import { IToggleOptions, IVisibilityMap } from "@/types";
import { TypeCheckBtn } from "../../../components";

export const ToggleBtnList = ({
  visibility,
  defaultSelectedKeys,
  toggleOptions,
  clickCallBack,
  visibilityCallback,
}: {
  visibility: IVisibilityMap;
  defaultSelectedKeys: string[];
  toggleOptions: IToggleOptions[];
  clickCallBack: (key: string) => void;
  visibilityCallback: (nodeTypeKey: string) => void;
}) => {
  return (
    <>
      {toggleOptions.map((pair: IToggleOptions, idx: number) => {
        return (
          <TypeCheckBtn
            key={pair.key}
            {...{
              idx,
              pair,
              visibility,
              isActiveFunc: (i: string) => defaultSelectedKeys.includes(i),
              visibilityCallback,
              clickCallBack,
            }}
          />
        );
      })}
    </>
  );
};
