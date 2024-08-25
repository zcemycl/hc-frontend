import { Dispatch, SetStateAction } from "react";

export const DummySetStateFactory = <T,>() => {
  return function (value: React.SetStateAction<T>): void {
    throw new Error("Function not implemented.");
  };
};

export const numberDummySetState = DummySetStateFactory<number>();
export const booleanDummySetState = DummySetStateFactory<boolean>();
export const stringDummySetState = DummySetStateFactory<string>();

export type TDummySetState<T> = Dispatch<SetStateAction<T>>;
export type TNumberDummySetState = TDummySetState<number>;
export type TBooleanDummySetState = TDummySetState<boolean>;
export type TStringDummySetState = TDummySetState<string>;
