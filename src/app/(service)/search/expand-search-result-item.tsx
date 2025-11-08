import { FdaLabel } from "@/components";
import { SearchSupportContext, FdaVersionsContext } from "@/contexts";
import { useContext } from "react";

export default function ExpandSearchResultItem() {
  const { displayData, displayDataIndex, setDisplayDataIndex } =
    useContext(SearchSupportContext);
  const { versions } = useContext(FdaVersionsContext);

  return (
    <>
      {displayData.length > 0 && displayDataIndex != null && (
        <div
          className="flex flex-col sm:w-3/4
          justify-center align-middle items-center mt-5"
        >
          <FdaLabel
            each={displayData[displayDataIndex]}
            displayDataIndex={displayDataIndex}
            back_btn_callback={(s) => setDisplayDataIndex(s)}
            versions={versions}
          />
        </div>
      )}
    </>
  );
}
