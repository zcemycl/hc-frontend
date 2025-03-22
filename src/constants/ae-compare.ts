export enum AETableTypeEnum {
  adverse_effect_table = "ae",
  Laboratory_test_table = "lt",
  unclassified = "unclassified",
  empty = "",
}

export interface I_tabletype_compare_caption {
  [key: string]: string;
}

export const tabletype_compare_caption: I_tabletype_compare_caption = {
  ae: "Comparison Table for Adverse Reaction",
  lt: "Comparison Table for Laboratory Test",
  unclassified: "Comparison Table for Unclassified",
  "": "",
};
