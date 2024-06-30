import { IDrugInteraction } from "@/types";
import { TypographyH2 } from "../typography";
import { TitleContent } from "./TitleContent";

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
              key={`di-${contentid}`}
              {...{ data: contentdata, includeTitle: true }}
            />
          ))}
        </>
      )}
    </>
  );
}

export { DrugInteractionSection };
