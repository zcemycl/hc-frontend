"use client";
import { IToggleOptions } from "@/types";
import { TypeCheckBtn } from "../../../components";

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
          <TypeCheckBtn
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
