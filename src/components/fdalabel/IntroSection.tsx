import { convert_datetime_to_date } from "@/utils";
import { TypographyH2 } from "../typography";

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

export { IntroSection };
