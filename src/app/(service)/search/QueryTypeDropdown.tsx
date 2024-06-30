"use client";

import { DropDownBtn, DropDownList } from "@/components";
import { queryTypeMap } from "@/constants";
import { useState } from "react";
import { SearchQueryTypeEnum } from "./types";

const QueryTypeDropdown = ({
  queryType,
  setQueryType,
  additionalResetCallback,
}: {
  queryType: SearchQueryTypeEnum;
  setQueryType: (q: any) => void;
  additionalResetCallback: () => void;
}) => {
  const [isQueryTypeDropdownOpen, setIsQueryTypeDropdownOpen] = useState(false);
  return (
    <div className="transition-all">
      <DropDownBtn
        onClick={() => setIsQueryTypeDropdownOpen(!isQueryTypeDropdownOpen)}
      >
        Query Type:{" "}
        {
          queryTypeMap.filter((each) => each.queryType === queryType)[0]
            .queryDisplayName
        }
      </DropDownBtn>
      <div
        className="flex w-full justify-end h-0"
        // ref={refDropDown}
      >
        <DropDownList
          selected={queryType}
          displayNameKey="queryDisplayName"
          selectionKey="queryType"
          allOptions={queryTypeMap}
          isOpen={isQueryTypeDropdownOpen}
          setSelectionKey={setQueryType}
          resetCallback={() => {
            setIsQueryTypeDropdownOpen(false);
            additionalResetCallback();
          }}
        />
      </div>
    </div>
  );
};

export { QueryTypeDropdown };
