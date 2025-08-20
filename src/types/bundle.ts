import { ApiResult } from "./api";
import { IFdaLabelRef } from "./fdalabel";

export interface IBundleConfig {
  name: string;
  description: string;
}

export interface IBundle {
  id: string;
  name: string;
  description: string;
  fdalabels: IFdaLabelRef[];
}

export interface IBundleUpdate {
  name?: string;
  description?: string;
  tradenames?: string[];
}

// API Result interfaces
export interface BundlesResult extends ApiResult<IBundle[]> {}
export interface BundleResult extends ApiResult<IBundle> {}
