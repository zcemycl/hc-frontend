import { VerDropdown } from "@/components";
import { FdaVersionsContext } from "@/contexts";
import { useContext } from "react";

export default function VerToolbar() {
  const { versions, setVersions } = useContext(FdaVersionsContext);
  return (
    <div
      className="
            flex 
            flex-row
            w-full
            space-x-2
            sm:w-11/12 md:w-8/12
            sm:px-10
            justify-start"
    >
      <VerDropdown />
      <VerDropdown
        verKey="adverse_effect_table"
        displayName="Adverse Reaction Table Version"
      />
    </div>
  );
}
