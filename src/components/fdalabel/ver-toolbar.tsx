"use client";
import { VerDropdown } from "@/components";
import { FdaVersionsContext, useAuth } from "@/contexts";
import { RELOAD_ICON_URI } from "@/icons/bootstrap";
import { formatUnderscoreString } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext } from "react";

function VerToolbar({
  fdaSections,
  reloadCallback,
}: {
  fdaSections: string[];
  reloadCallback: () => void;
}) {
  const router = useRouter();
  const { sectionVersions } = useContext(FdaVersionsContext);
  const { setIsAuthenticated, credentials } = useAuth();
  return (
    <div className="flex flex-col space-y-1 w-full items-center">
      <div
        className="
              flex 
              flex-row
              flex-wrap
              w-full
              space-x-0
              space-y-1
              align-center
              items-center
              justify-start"
      >
        {fdaSections
          // .filter(v => v!== "fdalabel")
          .map(
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
            if (credentials.length === 0) {
              setIsAuthenticated(false);
              router.push("/logout");
            }
            await reloadCallback();
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

export { VerToolbar };
