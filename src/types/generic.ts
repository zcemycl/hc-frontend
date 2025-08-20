import { ApiResult } from "./api";

export type IInitialData = Record<string, any>;
export type IGenericMap = IInitialData;
export interface EmptyResult extends ApiResult<{}> {}
export interface GenericMapResult extends ApiResult<IGenericMap> {}
