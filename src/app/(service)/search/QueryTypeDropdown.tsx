"use client";

import { DropDownBtn, DropDownList } from "@/components";
import { queryTypeMap, SearchQueryTypeEnum } from "@/constants";
import { useState } from "react";

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
        extraClassName="justify-end w-full"
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
