"use client";
import { TypographyH2 } from "../typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { ITherapeuticArea } from "@/types/fdalabel";
import { useRouter } from "next/navigation";

function FdaLabelShort({
  setid,
  tradename,
  showCheckbox,
  initial_us_approval_year,
  distance,
  indication,
  therapeutic_areas,
  ae_tables_count,
  ct_tables_count,
  selectMultipleCallback,
  clickExpandCallback,
}: {
  setid: string;
  tradename: string;
  showCheckbox: boolean;
  initial_us_approval_year: number;
  distance: number;
  indication: string;
  therapeutic_areas: ITherapeuticArea[];
  ae_tables_count: number;
  ct_tables_count: number;

  selectMultipleCallback: (e: any) => void;
  clickExpandCallback: () => void;
}) {
  const router = useRouter();
  console.log(therapeutic_areas);
  return (
    <div
      className="flex flex-col p-10
      w-screen sm:w-11/12 md:w-8/12"
      key={setid}
    >
      <div className="flex justify-between">
        <TypographyH2>{tradename}</TypographyH2>
        <input
          type="checkbox"
          checked={showCheckbox}
          onClick={(e) => selectMultipleCallback(e)}
          readOnly={true}
        />
      </div>
      <div className="content-center align-middle">
        <span className="flex space-x-1 items-center">
          <FontAwesomeIcon size="sm" icon={faTable} />
          <span>AE</span>
          <span>{ae_tables_count}</span>
          <span>CT</span>
          <span>{ct_tables_count}</span>
        </span>
      </div>
      <TypographyH2>{setid}</TypographyH2>
      <TypographyH2>
        Initial US Approval Year: {initial_us_approval_year}
      </TypographyH2>
      {distance && (
        <TypographyH2>Indication Proximity: {distance.toFixed(3)}</TypographyH2>
      )}
      <div
        className="flex flex-col space-y-0
        items-start w-full overflow-x-auto
        justify-start
        "
      >
        <button
          className="bg-sky-300 hover:bg-sky-400
          text-black font-bold py-2 px-4 rounded
          "
          onClick={(e) => {
            e.preventDefault();
            router.push(
              `/discovery?therapeutic_area=${therapeutic_areas[0].path}`,
            );
          }}
        >
          <TypographyH2 extraClass="text-black">
            {therapeutic_areas[0]?.path.replaceAll("_", " ").split(".")[0]}
          </TypographyH2>
        </button>
      </div>

      <p>{indication}</p>
      <button
        onClick={(e) => {
          e.preventDefault();
          clickExpandCallback();
        }}
      >
        View more...
      </button>
      <hr />
    </div>
  );
}

export { FdaLabelShort };
