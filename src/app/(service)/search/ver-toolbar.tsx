import { VerDropdown } from "@/components";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { FdaVersionsContext, SearchSupportContext, useAuth } from "@/contexts";
import { RELOAD_ICON_URI } from "@/icons/bootstrap";
import { useRouter } from "next/navigation";
import { useContext } from "react";

function formatUnderscoreString(input: string): string {
  return input
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function VerToolbar() {
  const router = useRouter();
  const { sectionVersions, versions } = useContext(FdaVersionsContext);
  const { setIsAuthenticated, credentials } = useAuth();
  const {
    queryType,
    pageN,
    nPerPage,
    search_query_by_type,
    fdaservice,
    query,
    sortBy,
  } = useContext(SearchSupportContext);
  return (
    <div
      className="flex flex-col space-y-1
      w-full sm:w-11/12 md:w-8/12
      sm:px-10"
    >
      <div
        className="
              flex 
              flex-row
              flex-wrap
              w-full
              space-x-2
              space-y-1
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
        <button
          onClick={async (e) => {
            e.preventDefault();
            if (query[0] === "") return;
            if (credentials.length === 0) {
              setIsAuthenticated(false);
              router.push("/logout");
            }
            console.log(versions);

            const resp = await search_query_by_type(
              fdaservice,
              query,
              queryType,
              pageN,
              nPerPage,
              sortBy,
              versions,
            );
            console.log(resp);
          }}
        >
          <img
            src={RELOAD_ICON_URI}
            className="rounded-full bg-emerald-400 hover:bg-emerald-600"
          />
        </button>
      </div>
    </div>
  );
}
