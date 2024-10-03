import { Dispatch, SetStateAction } from "react";

export interface IBaseTable {
  table: string[][];
}

export interface IBaseSelectTable {
  table: boolean[][];
}

export interface IBaseTableNoHead {
  content: IBaseTable;
  isSelectable?: IBaseSelectTable;
  isSelected?: IBaseSelectTable;
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

export interface IFdaLabel {
  id?: number;
  setid?: string;
  tradename: string;
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
}

export interface IFdaLabelHistory {
  setids?: string[];
  manufacturers?: string[];
  spl_earliest_dates?: string[];
  spl_effective_dates?: string[];
}

export interface ICompareAETable extends IBaseTable {}

export interface IUnAnnotatedAETable {
  idx: number;
  fdalabel: IFdaLabel;
  adverse_effect_table?: IAdverseEffectTable;
  clinical_trial_table?: IClinicalTrialTable;
  created_date?: string;
}
