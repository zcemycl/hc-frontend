"use client";

import React, { memo, useState } from "react";
import { AETableVerEnum, aeTableVersionMap } from "@/constants";
import { DropDownBtn, DropDownList } from "./BasicDropdown";

const AETableVerDropdown = React.memo(
  ({
    verType,
    setVerType,
    additionalResetCallback,
  }: {
    verType: AETableVerEnum;
    setVerType: (q: any) => void;
    additionalResetCallback: () => void;
  }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    return (
      <div className="transition-all">
        <DropDownBtn onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {
            aeTableVersionMap.filter((each) => each.verType === verType)[0]
              .verDisplayName
          }
        </DropDownBtn>
        <div
          className="flex w-full justify-end h-0"
          // ref={refDropDown}
        >
          <DropDownList
            selected={verType}
            displayNameKey="verDisplayName"
            selectionKey="verType"
            allOptions={aeTableVersionMap}
            isOpen={isDropdownOpen}
            setSelectionKey={setVerType}
            resetCallback={() => {
              setIsDropdownOpen(false);
              additionalResetCallback();
            }}
          />
        </div>
      </div>
    );
  },
);

AETableVerDropdown.displayName = "AETableVerDropdown";

export { AETableVerDropdown };
