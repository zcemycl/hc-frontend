"use client";
import { IFdaLabel, IFdaVersions } from "@/types";
import { IntroSection } from "./IntroSection";
import { IndicationSection } from "./IndicationSection";
import { AdverseReactionSection } from "./AdverseReactionSection";
import { DrugInteractionSection } from "./DrugInteractionSection";
import { ClinicalTrialSection } from "./ClinicalTrialSection";
import { FdaLabelHistory } from "./FdaLabelHistory";
import { GeneralSection } from "./GeneralSection";

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
    <div className="flex flex-col w-full space-y-3">
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
      {/* section 1 */}
      <IndicationSection indication={each.indication!} />
      {/* section 3 */}
      {each.dosage_forms!.length === 1 && (
        <GeneralSection
          title={"Drug Interactions"}
          section={each.dosage_forms![0]}
          tables={[]}
        />
      )}
      {/* section 6 */}
      <AdverseReactionSection
        setid={each.setid!}
        adverse_effect_tables={each.adverse_effect_tables!}
      />
      {/* section 7 */}
      {each.drug_interactions!.length > 1 ? (
        <DrugInteractionSection drug_interactions={each.drug_interactions!} />
      ) : (
        <GeneralSection
          title={"Drug Interactions"}
          section={each.drug_interactions![0]}
          tables={[]}
        />
      )}
      {/* section 14 */}
      {each.clinical_trials!.length > 1 ? (
        <ClinicalTrialSection
          clinical_trials={each.clinical_trials!}
          clinical_trial_tables={each.clinical_trial_tables!}
        />
      ) : (
        <GeneralSection
          title={"Clinical Trial"}
          section={each.clinical_trials![0]}
          tables={each.clinical_trial_tables!}
        />
      )}
      <FdaLabelHistory
        setid={each.setid!}
        displayDataIndex={displayDataIndex}
        versions={versions}
      />
    </div>
  );
}

export { FdaLabel };
