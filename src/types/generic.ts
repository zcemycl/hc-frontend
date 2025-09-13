import { ApiResult } from "./api";

export type IInitialData = Record<string, any>;
export type IGenericMap = IInitialData;
export interface EmptyResult extends ApiResult<{}> {}
export interface GenericMapResult extends ApiResult<IGenericMap> {}

export interface IToggleOptions {
  key: string;
  displayName: string;
  [key: string]: any;
}
