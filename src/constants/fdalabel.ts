export const DEFAULT_FDALABEL_VERSIONS = {
  fdalabel: "v0.0.0",
  indication_usage: "v0.0.0",
  dosage_administration: "v0.0.0",
  dosage_form: "v0.0.0",
  contraindication: "v0.0.0",
  adverse_effect: "v0.0.0",
  adverse_effect_table: "v0.0.0",
  drug_interaction: "v0.0.0",
  clinical_trial: "v0.0.0",
  clinical_trial_table: "v0.0.0",
};

export const DEFAULT_FDALALBEL_SECTION_AVAILABLE_VERS = Object.fromEntries(
  Object.entries(DEFAULT_FDALABEL_VERSIONS).map(([key, value]) => [
    `${key}_available_versions`,
    [value],
  ]),
);
