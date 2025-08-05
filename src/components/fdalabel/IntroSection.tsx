"use client";
import { convert_datetime_to_date } from "@/utils";
import { TypographyH2 } from "../typography";
import { ITherapeuticArea } from "@/types/fdalabel";
import { useRouter } from "next/navigation";

function IntroSection({
  tradename,
  setid,
  therapeutic_areas,
  spl_earliest_date,
  spl_effective_date,
  manufacturer,
  xml_link,
  pdf_link,
  back_btn_callback,
}: {
  tradename: string;
  setid: string;
  therapeutic_areas: ITherapeuticArea[];
  spl_earliest_date: string;
  spl_effective_date: string;
  manufacturer: string;
  xml_link: string;
  pdf_link: string;
  back_btn_callback: (s: any) => void;
}) {
  const router = useRouter();
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
            let redirectUrl = `/discovery`;
            const params = new URLSearchParams();
            params.append("therapeutic_area", therapeutic_areas[0].path);
            params.append("product_name", tradename.toLowerCase().trim());
            redirectUrl = `${redirectUrl}?${params}`;
            router.push(redirectUrl);
          }}
        >
          <TypographyH2 extraClass="text-black">
            {therapeutic_areas[0]?.path.replaceAll("_", " ").split(".")[0]}
          </TypographyH2>
        </button>
      </div>

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

export { IntroSection };
