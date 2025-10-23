import { ApiResult } from "./api";
import { IFdaLabelRef } from "./fdalabel";
import { IAnnotationRef } from "./annotation";
import { IUserRef, UserRoleEnum } from "./users";

export interface IBundleConfig {
  id?: string;
  name: string;
  description: string;
}

export interface IBundleUserLinkRef {
  user_id: number;
  role: UserRoleEnum;
}

export interface IBundle {
  id: string;
  name: string;
  description: string;
  fdalabels: IFdaLabelRef[];
  annotations: IAnnotationRef[];
  users: IUserRef[];
  user_links?: IBundleUserLinkRef[];
}

export interface IBundleUpdate {
  name?: string;
  description?: string;
  tradenames?: string[];
  annotation_ids?: number[];
  emails?: string[];
}

// API Result interfaces
export interface BundlesResult extends ApiResult<IBundle[]> {}
export interface BundleResult extends ApiResult<IBundle> {}
export interface BundleCountResult extends ApiResult<number> {}
