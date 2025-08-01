import { VerDropdown } from "@/components";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { FdaVersionsContext } from "@/contexts";
import { useContext } from "react";

function formatUnderscoreString(input: string): string {
  return input
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function VerToolbar() {
  const { sectionVersions } = useContext(FdaVersionsContext);
  return (
    <div
      className="
            flex 
            flex-row
            flex-wrap
            w-full
            space-x-2
            space-y-1
            sm:w-11/12 md:w-8/12
            sm:px-10
            align-center
            justify-start"
    >
      {Object.keys(DEFAULT_FDALABEL_VERSIONS).map(
        (key) =>
          sectionVersions[`${key}_available_versions`] !== null && (
            <VerDropdown
              key={key}
              verKey={key}
              displayName={`${formatUnderscoreString(key)} Version`}
            />
          ),
      )}
    </div>
  );
}
