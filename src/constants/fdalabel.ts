export const DEFAULT_FDALABEL_VERSIONS = {
  fdalabel: "v0.0.2",
  indication_usage: "v0.0.2",
  dosage_administration: "v0.0.2",
  dosage_form: "v0.0.2",
  contraindication: "v0.0.2",
  adverse_effect: "v0.0.2",
  adverse_effect_table: "v0.0.2",
  drug_interaction: "v0.0.2",
  clinical_trial: "v0.0.2",
  clinical_trial_table: "v0.0.2",
};

export const DEFAULT_FDALALBEL_SECTION_AVAILABLE_VERS = Object.fromEntries(
  Object.entries(DEFAULT_FDALABEL_VERSIONS).map(([key, value]) => [
    `${key}_available_versions`,
    [value],
  ]),
);
