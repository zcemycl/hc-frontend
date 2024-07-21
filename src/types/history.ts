export enum UserHistoryCategoryEnum {
  ANNOTATION = "Annotation",
  LOGIN = "Login",
  JUPYTERLAB = "Jupyter Lab",
  PRELOGIN = "Pre-Login",
  SEARCH = "Search",
  CHATBOT = "Chatbot",
}

export enum AnnotationCategoryEnum {
  ADVERSE_EFFECT_TABLE = "adverse_effect_table",
  CLINICAL_TRIAL_TABLE = "clinical_trial_table",
}

export interface IHistory {
  id: number;
  created_date: string;
  category: UserHistoryCategoryEnum;
  detail: {
    action: string;
    query: string[];
    additional_settings: {
      [key: string]: any;
    };
  };
}
