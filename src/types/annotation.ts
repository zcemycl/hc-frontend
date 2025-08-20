import { ApiResult } from "./api";
import {
  IAdverseEffectTable,
  ITableNoHead,
  IUnAnnotatedAETable,
  IFdaVersions,
} from "./fdalabel";
import { AnnotationCategoryEnum } from "./history";

// API Result interfaces
export interface UnannotatedAETableResult
  extends ApiResult<IUnAnnotatedAETable[]> {}
export interface CountResult extends ApiResult<number> {}
export interface AETableResult extends ApiResult<IAdverseEffectTable> {}
export interface TableNoHeadResult extends ApiResult<ITableNoHead[]> {}
