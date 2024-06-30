import {
  IBaseTitleContent,
  IClinicalTrial,
  IClinicalTrialTable,
} from "@/types";
import { TypographyH2, Table } from "@/components";

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

export { TitleContent, ClinicalTrialSection };
