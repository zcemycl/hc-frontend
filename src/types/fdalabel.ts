import { Dispatch, SetStateAction } from "react";

export interface IBaseTable {
  [key: string]: string[][];
}

export interface IBaseSelectTable {
  table: boolean[][];
}

export interface IBaseTableNoHead {
  content: IBaseTable;
  keyname: string;
  version?: string;
  caption?: string;
  isSelectable?: IBaseSelectTable;
  isSelected?: IBaseSelectTable;
  hasCopyBtn?: boolean;
  setIsCellSelected?: Dispatch<SetStateAction<boolean[][]>>;
}

export interface IBaseTitleContent {
  id: number;
  tag: string;
  content: string;
}

export interface IAdverseEffectTable extends IBaseTableNoHead {
  id: number;
  s3_bucket?: string;
  s3_key?: string;
}

export interface IClinicalTrial extends IBaseTitleContent {}

export interface IClinicalTrialTable extends IBaseTableNoHead {
  id: number;
  s3_bucket?: string;
  s3_key?: string;
}

export interface IDrugInteraction extends IBaseTitleContent {}

export interface IFdaLabelRef {
  id?: number;
  setid?: string;
  tradename: string;
}

export interface IFdaLabel extends IFdaLabelRef {
  distance?: number;
  indication?: string;
  manufacturer?: string;
  pdf_link?: string;
  xml_link?: string;
  s3_bucket?: string;
  s3_key?: string;
  initial_us_approval_year?: number;
  spl_effective_date: string;
  spl_earliest_date: string;
  adverse_effect_tables?: IAdverseEffectTable[];
  clinical_trials?: IClinicalTrial[];
  clinical_trial_tables?: IClinicalTrialTable[];
  drug_interactions?: IDrugInteraction[];
  ae_tables_count?: number;
  ct_tables_count?: number;
}

export interface IFdaLabelHistory {
  setids?: string[];
  manufacturers?: string[];
  spl_earliest_dates?: string[];
  spl_effective_dates?: string[];
}

export interface ICompareAETable extends IBaseTable {}

export interface ITherapeuticArea {
  name: string;
  path: string;
}

export interface IUnAnnotatedAETable {
  idx: number;
  fdalabel: IFdaLabel;
  adverse_effect_table?: IAdverseEffectTable;
  clinical_trial_table?: IClinicalTrialTable;
  therapeutic_area?: ITherapeuticArea;
  created_date?: string;
  modified_date?: string;
  relative_idx?: number;
}

export interface ITherapeuticAreaGroupTables {
  [key: string]: IUnAnnotatedAETable[];
}
