import { TypographyH2 } from "../typography";

function IndicationSection({ indication }: { indication: string }) {
  return (
    <>
      <hr />
      <TypographyH2>INDICATIONS AND USAGE</TypographyH2>
      <p>{indication}</p>
    </>
  );
}

export { IndicationSection };
