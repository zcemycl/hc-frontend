"use client";
import {
  IAdverseEffectTable,
  IBaseTitleContent,
  IClinicalTrial,
  IClinicalTrialTable,
  IDrugInteraction,
  IFdaLabel,
  IFdaLabelHistory,
  UserRoleEnum,
} from "@/types";
import { Table, TableFromCols } from "../table";
import { TypographyH2 } from "../typography";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState, useId } from "react";
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

function IntroSection({
  tradename,
  setid,
  spl_earliest_date,
  spl_effective_date,
  manufacturer,
  xml_link,
  pdf_link,
  back_btn_callback,
}: {
  tradename: string;
  setid: string;
  spl_earliest_date: string;
  spl_effective_date: string;
  manufacturer: string;
  xml_link: string;
  pdf_link: string;
  back_btn_callback: (s: any) => void;
}) {
  return (
    <>
      <div className="flex justify-between">
        <TypographyH2>{tradename}</TypographyH2>
        <button
          onClick={(e) => {
            e.preventDefault();
            back_btn_callback(null);
          }}
        >
          Back
        </button>
      </div>
      <TypographyH2>{setid}</TypographyH2>
      <TypographyH2>
        {convert_datetime_to_date(spl_earliest_date)} -{" "}
        {convert_datetime_to_date(spl_effective_date)}
      </TypographyH2>
      <TypographyH2>{manufacturer}</TypographyH2>
      <p className="leading-relaxed">
        XML source:{" "}
        <a href={xml_link} target="_blank">
          {xml_link}
        </a>
      </p>
      <p className="leading-relaxed">
        Download pdf:{" "}
        <a href={pdf_link} target="_blank">
          {pdf_link}
        </a>
      </p>
    </>
  );
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
      {(drug_interactions as IDrugInteraction[])?.length > 0 && (
        <>
          <TypographyH2>DRUG INTERACTIONS</TypographyH2>
          {drug_interactions!.map((contentdata, contentid) => (
            <TitleContent
              key={contentid}
              {...{ data: contentdata, includeTitle: true }}
            />
          ))}
        </>
      )}
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
  const id = useId();
  const router = useRouter();
  const { role } = useAuth();
  return (
    <Fragment key={id}>
      {(adverse_effect_tables as IAdverseEffectTable[])?.length > 0 && (
        <Fragment key={id}>
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
              <Fragment key={`${id}-${tableid}`}>
                <Table {...tabledata} />
                <hr />
              </Fragment>
            );
          })}
        </Fragment>
      )}
    </Fragment>
  );
}

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
              key={contentid}
              {...{
                data: contentdata,
                includeTitle: contentdata.content !== "14 CLINICAL STUDIES",
              }}
            />
          ))}
          {clinical_trial_tables!.map((tabledata, tableid) => {
            return (
              <Fragment key={`${id}-${tableid}`}>
                <Table key={tableid} {...tabledata} />
                <hr />
              </Fragment>
            );
          })}
        </Fragment>
      )}
    </Fragment>
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

function FdaLabel({
  each,
  back_btn_callback,
  displayDataIndex,
}: {
  each: IFdaLabel;
  displayDataIndex: number | null;
  back_btn_callback: (s: any) => void;
}) {
  return (
    <>
      <IntroSection
        {...{
          setid: each.setid!,
          tradename: each.tradename!,
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
      />
    </>
  );
}

export {
  TitleContent,
  IntroSection,
  IndicationSection,
  AdverseReactionSection,
  ClinicalTrialSection,
  DrugInteractionSection,
  FdaLabelHistory,
  FdaLabel,
};
