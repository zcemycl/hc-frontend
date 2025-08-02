"use client";
import { useContext, useMemo, useState } from "react";
import { DropDownBtn, DropDownList } from "./BasicDropdown";
import { FdaVersionsContext } from "@/contexts";

const VerDropdown = ({
  verKey = "fdalabel",
  displayName = "FDA Scrape Version",
}: {
  verKey?: string;
  displayName?: string;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { versions, setVersions, fdaVers, sectionVersions } =
    useContext(FdaVersionsContext);
  const optMap = useMemo(() => {
    if (verKey === "fdalabel") {
      return fdaVers.map((val: string) => ({
        verType: val,
        verDisplayName: val,
      }));
    } else {
      const tmpVersions = sectionVersions[`${verKey}_available_versions`];
      if (tmpVersions === null) {
        return [];
      }
      return tmpVersions.map((val: string) => ({
        verType: val,
        verDisplayName: val,
      }));
    }
  }, [fdaVers, sectionVersions]);
  return (
    <div className="transition-all">
      <DropDownBtn onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {displayName}: {versions[verKey]}
      </DropDownBtn>
      <div
        className="flex w-full justify-end h-0"
        // ref={refDropDown}
      >
        <DropDownList
          selected={versions[verKey]}
          displayNameKey="verDisplayName"
          selectionKey="verType"
          allOptions={optMap}
          isOpen={isDropdownOpen}
          setSelectionKey={(s: string) => {
            setVersions((prev: { [key: string]: string }) => {
              let newVers = { ...prev };
              if (verKey === "fdalabel") {
                newVers = {
                  ...newVers,
                  ...Object.fromEntries(
                    Object.keys(newVers).map((key) => [key, s]),
                  ),
                };
              } else {
                newVers = {
                  ...newVers,
                  [verKey]: s,
                };
              }
              return newVers;
            });
          }}
          resetCallback={() => {
            setIsDropdownOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export { VerDropdown };
