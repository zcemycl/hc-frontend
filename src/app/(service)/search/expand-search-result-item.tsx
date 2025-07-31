import { FdaLabel } from "@/components";
import { SearchSupportContext } from "@/contexts";
import { useContext } from "react";

export default function ExpandSearchResultItem() {
  const { displayData, displayDataIndex, setDisplayDataIndex } =
    useContext(SearchSupportContext);
  return (
    <>
      {displayData.length > 0 && displayDataIndex != null && (
        <div className="sm:w-1/2 flex flex-col w-screen">
          <FdaLabel
            each={displayData[displayDataIndex]}
            displayDataIndex={displayDataIndex}
            back_btn_callback={(s) => setDisplayDataIndex(s)}
          />
        </div>
      )}
    </>
  );
}
