import { TypographyH2 } from "../typography";

function FdaLabelShort({
  setid,
  tradename,
  showCheckbox,
  initial_us_approval_year,
  distance,
  indication,
  selectMultipleCallback,
  clickExpandCallback,
}: {
  setid: string;
  tradename: string;
  showCheckbox: boolean;
  initial_us_approval_year: number;
  distance: number;
  indication: string;
  selectMultipleCallback: (e: any) => void;
  clickExpandCallback: () => void;
}) {
  return (
    <div className="sm:w-1/2 flex flex-col w-screen p-10" key={setid}>
      <div className="flex justify-between">
        <TypographyH2>{tradename}</TypographyH2>
        <input
          type="checkbox"
          checked={showCheckbox}
          onClick={(e) => selectMultipleCallback(e)}
          readOnly={true}
        />
      </div>
      <TypographyH2>{setid}</TypographyH2>
      <TypographyH2>
        Initial US Approval Year: {initial_us_approval_year}
      </TypographyH2>
      {distance && (
        <TypographyH2>Indication Proximity: {distance.toFixed(3)}</TypographyH2>
      )}
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
