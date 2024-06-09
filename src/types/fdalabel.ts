export interface IAdverseEffectTable {
  content: { table: string[][] };
}

export interface IClinicalTrial {
  content: string;
  id: number;
  tag: string;
}

export interface IClinicalTrialTable {
  id: number;
  s3_bucket?: string;
  s3_key?: string;
  content: { table: string[][] };
}

export interface IDrugInteraction {
  content: string;
  id: number;
  tag: string;
}

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
}

export interface IFdaLabelHistory {
  setids?: string[];
  manufacturers?: string[];
  spl_earliest_dates?: string[];
  spl_effective_dates?: string[];
}

export interface ICompareAETable {
  table?: string[][];
}
