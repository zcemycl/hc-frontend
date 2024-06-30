import {
  IBaseTitleContent,
  IClinicalTrial,
  IClinicalTrialTable,
  IDrugInteraction,
} from "@/types";
import { Table } from "../table";
import { TypographyH2 } from "../typography";

interface ITitleContentProps {
  data: IBaseTitleContent;
  includeTitle: boolean;
}

function TitleContent({ data, includeTitle }: ITitleContentProps) {
  if (data.tag === "title" && includeTitle) {
    return (
      <h3 className="text-white text-lg mb-1 font-medium title-font">
        {data.content}
      </h3>
    );
  } else if (data.tag === "content") {
    return <p>{data.content}</p>;
  }
}

function IndicationSection({ indication }: { indication: string }) {
  return (
    <>
      <TypographyH2>INDICATIONS AND USAGE</TypographyH2>
      <p>{indication}</p>
    </>
  );
}

function DrugInteractionSection({
  drug_interactions,
}: {
  drug_interactions: IDrugInteraction[];
}) {
  return (
    <>
      <TypographyH2>DRUG INTERACTIONS</TypographyH2>
      {drug_interactions!.map((contentdata, contentid) => (
        <TitleContent
          key={contentid}
          {...{ data: contentdata, includeTitle: true }}
        />
      ))}
    </>
  );
}

function ClinicalTrialSection({
  clinical_trials,
  clinical_trial_tables,
}: {
  clinical_trials: IClinicalTrial[];
  clinical_trial_tables: IClinicalTrialTable[];
}) {
  return (
    <>
      <TypographyH2>CLINICAL TRIALS</TypographyH2>
      {clinical_trials!.map((contentdata, contentid) => (
        <TitleContent
          key={contentid}
          {...{
            data: contentdata,
            includeTitle: contentdata.content !== "14 CLINICAL STUDIES",
          }}
        />
      ))}
      {clinical_trial_tables!.map((tabledata, tableid) => {
        return (
          <>
            <Table key={tableid} {...tabledata} />
            <hr />
          </>
        );
      })}
    </>
  );
}

export {
  TitleContent,
  IndicationSection,
  ClinicalTrialSection,
  DrugInteractionSection,
};
