import { ApiResult } from "./api";
import {
  IAdverseEffectTable,
  IFdaLabelRef,
  ITableNoHead,
  IUnAnnotatedAETable,
} from "./fdalabel";
import { AnnotationCategoryEnum } from "./history";

export interface IDropdownOption {
  displayName: string;
  type: string;
}

export interface IDropdownGenericOption {
  [x: string]: string;
}

export interface IDropdownQuestion {
  displayName: string;
  identifier: string;
  type: string;
  defaultOption: string;
  options: IDropdownOption[];
}

export interface IAdditionalRequirementQuestion {
  dropdown?: IDropdownQuestion;
}

export interface IQuestionTemplate {
  displayName: string;
  mapMode: string;
  identifier: string;
  additionalRequire: IAdditionalRequirementQuestion;
}

export interface IAnnotateAddReceipt {
  id: number;
  category: AnnotationCategoryEnum;
  is_ai: boolean;
}

export interface IAnnotationRef {
  id: number;
  table_id: number;
  category: AnnotationCategoryEnum;
}

export interface IAnnotationSource {
  fdalabel: IFdaLabelRef;
  adverse_effect_table?: IAdverseEffectTable;
  relative_id?: number;
  setid?: string;
  category: AnnotationCategoryEnum;
}

export interface IAnnotationSourceMap {
  [x: string | number]: IAnnotationSource;
}

// API Result interfaces
export interface UnannotatedAETableResult
  extends ApiResult<IUnAnnotatedAETable[]> {}
export interface CountResult extends ApiResult<number> {}
export interface AETableResult extends ApiResult<IAdverseEffectTable> {}
export interface TableNoHeadResult extends ApiResult<ITableNoHead[]> {}
export interface AnnotateAddReceiptResult
  extends ApiResult<IAnnotateAddReceipt> {}
export interface AnnotateSourceMapResult
  extends ApiResult<IAnnotationSourceMap> {}
