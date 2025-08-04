"use client";
import { IFdaLabel, IFdaVersions } from "@/types";
import { IntroSection } from "./IntroSection";
import { IndicationSection } from "./IndicationSection";
import { AdverseReactionSection } from "./AdverseReactionSection";
import { DrugInteractionSection } from "./DrugInteractionSection";
import { ClinicalTrialSection } from "./ClinicalTrialSection";
import { FdaLabelHistory } from "./FdaLabelHistory";

function FdaLabel({
  each,
  back_btn_callback,
  displayDataIndex,
  versions,
}: {
  each: IFdaLabel;
  displayDataIndex: number | null;
  back_btn_callback: (s: any) => void;
  versions: IFdaVersions;
}) {
  return (
    <div className="flex flex-col w-full">
      <IntroSection
        {...{
          setid: each.setid!,
          tradename: each.tradename!,
          therapeutic_areas: each.therapeutic_areas!,
          spl_earliest_date: each.spl_earliest_date!,
          spl_effective_date: each.spl_effective_date!,
          manufacturer: each.manufacturer!,
          xml_link: each.xml_link!,
          pdf_link: each.pdf_link!,
          back_btn_callback,
        }}
      />
      <IndicationSection indication={each.indication!} />
      <AdverseReactionSection
        setid={each.setid!}
        adverse_effect_tables={each.adverse_effect_tables!}
      />
      <DrugInteractionSection drug_interactions={each.drug_interactions!} />
      <ClinicalTrialSection
        clinical_trials={each.clinical_trials!}
        clinical_trial_tables={each.clinical_trial_tables!}
      />
      <FdaLabelHistory
        setid={each.setid!}
        displayDataIndex={displayDataIndex}
        versions={versions}
      />
    </div>
  );
}

export { FdaLabel };
