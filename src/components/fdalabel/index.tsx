"use client";
import {
  IAdverseEffectTable,
  IBaseTitleContent,
  IClinicalTrial,
  IClinicalTrialTable,
  IDrugInteraction,
  IFdaLabelHistory,
  UserRoleEnum,
} from "@/types";
import { Table, TableFromCols } from "../table";
import { TypographyH2 } from "../typography";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchFdalabelHistoryBySetid } from "@/http/backend";
import { convert_datetime_to_date } from "@/utils";

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

function AdverseReactionSection({
  setid,
  adverse_effect_tables,
}: {
  setid: string;
  adverse_effect_tables: IAdverseEffectTable[];
}) {
  const router = useRouter();
  const { role } = useAuth();
  return (
    <>
      {(adverse_effect_tables as IAdverseEffectTable[])?.length > 0 && (
        <>
          <div className="flex justify-between py-2">
            <TypographyH2>ADVERSE REACTIONS</TypographyH2>
            {role === UserRoleEnum.ADMIN && (
              <button
                className="bg-red-600 
          hover:bg-red-700
          py-2 px-6 rounded
          text-white
          "
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/annotate/fdalabel/${setid}`);
                }}
              >
                Annotate
              </button>
            )}
          </div>

          {adverse_effect_tables!.map((tabledata, tableid) => {
            return (
              <>
                <Table key={tableid} {...tabledata} />
                <hr />
              </>
            );
          })}
        </>
      )}
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

function FdaLabelHistory({
  setid,
  displayDataIndex,
}: {
  setid: string;
  displayDataIndex: number | null;
}) {
  const router = useRouter();
  const [displayHistoryData, setDisplayHistoryData] =
    useState<IFdaLabelHistory>({});
  const { credentials, setIsAuthenticated } = useAuth();

  useEffect(() => {
    let resp;
    if (process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev") {
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        router.push("/logout");
      }
    }
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      resp = await fetchFdalabelHistoryBySetid(setid, credJson.AccessToken);
      setDisplayHistoryData(resp);
      console.log(resp);
    }
    if (displayDataIndex != null) {
      getData(credentials);
    } else setDisplayHistoryData({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayDataIndex]);

  return (
    <>
      {displayDataIndex != null &&
        displayHistoryData!.setids &&
        displayHistoryData!.setids!.length > 1 && (
          <>
            <TypographyH2>HISTORY</TypographyH2>
            <TableFromCols
              {...{
                keyvalue: {
                  setid: "Set ID",
                  manufacturers: "Manufacturer",
                  spl_earliest_dates: "SPL Earliest Date",
                  spl_effective_dates: "SPL Effective Date",
                },
                data: {
                  setid: displayHistoryData?.setids!,
                  manufacturers: displayHistoryData?.manufacturers!,
                  spl_earliest_dates:
                    displayHistoryData?.spl_earliest_dates!.map((x) =>
                      convert_datetime_to_date(x),
                    ),
                  spl_effective_dates:
                    displayHistoryData?.spl_effective_dates!.map((x) =>
                      convert_datetime_to_date(x),
                    ),
                },
              }}
            />
          </>
        )}
    </>
  );
}

export {
  TitleContent,
  IndicationSection,
  AdverseReactionSection,
  ClinicalTrialSection,
  DrugInteractionSection,
  FdaLabelHistory,
};
