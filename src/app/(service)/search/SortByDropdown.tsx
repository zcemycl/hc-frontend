"use client";

import { DropDownBtn, DropDownList } from "@/components";
import { useState } from "react";
import { sortByMap, SortByEnum } from "@/constants";

const SortByDropdown = ({
  sortBy,
  setSortBy,
  additionalResetCallback,
}: {
  sortBy: SortByEnum;
  setSortBy: (q: any) => void;
  additionalResetCallback: () => void;
}) => {
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);

  return (
    <div>
      <DropDownBtn
        extraClassName="justify-end w-full"
        onClick={() => setIsSortByDropdownOpen(!isSortByDropdownOpen)}
      >
        Sort By:{" "}
        {
          sortByMap.filter((each) => each.sortType === sortBy)[0]
            .sortDisplayName
        }
      </DropDownBtn>
      <div
        className="flex w-full justify-end h-0"
        // ref={refDropDown}
      >
        <DropDownList
          selected={sortBy}
          displayNameKey="sortDisplayName"
          selectionKey="sortType"
          allOptions={sortByMap}
          isOpen={isSortByDropdownOpen}
          setSelectionKey={setSortBy}
          resetCallback={() => {
            setIsSortByDropdownOpen(false);
            additionalResetCallback();
          }}
        />
      </div>
    </div>
  );
};

export { SortByDropdown };
