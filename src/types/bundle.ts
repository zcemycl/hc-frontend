import { ApiResult } from "./api";
import { IFdaLabelRef } from "./fdalabel";
import { IAnnotationRef } from "./annotation";

export interface IBundleConfig {
  id?: string;
  name: string;
  description: string;
}

export interface IBundle {
  id: string;
  name: string;
  description: string;
  fdalabels: IFdaLabelRef[];
  annotations: IAnnotationRef[];
}

export interface IBundleUpdate {
  name?: string;
  description?: string;
  tradenames?: string[];
  annotation_ids?: number[];
}

// API Result interfaces
export interface BundlesResult extends ApiResult<IBundle[]> {}
export interface BundleResult extends ApiResult<IBundle> {}
export interface BundleCountResult extends ApiResult<number> {}
