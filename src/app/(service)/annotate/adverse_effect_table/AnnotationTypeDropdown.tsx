"use client";

import { AnnotationTypeEnum, annotationTypeMap } from "@/constants";
import { useState } from "react";
import { DropDownBtn, DropDownList } from "@/components";

const AnnotationTypeDropdown = ({
  queryType,
  setQueryType,
  additionalResetCallback,
}: {
  queryType: AnnotationTypeEnum;
  setQueryType: (q: any) => void;
  additionalResetCallback: () => void;
}) => {
  const [isQueryTypeDropdownOpen, setIsQueryTypeDropdownOpen] = useState(false);
  return (
    <div className="transition-all">
      <DropDownBtn
        onClick={() => setIsQueryTypeDropdownOpen(!isQueryTypeDropdownOpen)}
      >
        {
          annotationTypeMap.filter((each) => each.queryType === queryType)[0]
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
          allOptions={annotationTypeMap}
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

export { AnnotationTypeDropdown };
