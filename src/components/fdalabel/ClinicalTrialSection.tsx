"use client";
import { IClinicalTrial, IClinicalTrialTable } from "@/types";
import { TitleContent } from "./TitleContent";
import { TypographyH2 } from "../typography";
import { Fragment, useId } from "react";
import { Table } from "../table";

function ClinicalTrialSection({
  clinical_trials,
  clinical_trial_tables,
}: {
  clinical_trials: IClinicalTrial[];
  clinical_trial_tables: IClinicalTrialTable[];
}) {
  const id = useId();
  return (
    <Fragment key={id}>
      {(clinical_trials as IClinicalTrial[])?.length > 0 && (
        <Fragment key={id}>
          <TypographyH2>CLINICAL TRIALS</TypographyH2>
          {clinical_trials!.map((contentdata, contentid) => (
            <TitleContent
              key={`ct-content-${contentid}`}
              {...{
                data: contentdata,
                includeTitle: contentdata.content !== "14 CLINICAL STUDIES",
              }}
            />
          ))}
          {clinical_trial_tables!.map((tabledata, tableid) => {
            return (
              <Fragment key={`${id}-${tableid}`}>
                <Table {...{ ...tabledata, keyname: "table" }} />
                <hr />
              </Fragment>
            );
          })}
        </Fragment>
      )}
    </Fragment>
  );
}

export { ClinicalTrialSection };
