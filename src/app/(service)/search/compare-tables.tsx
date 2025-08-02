import { Table } from "@/components";
import { AETableTypeEnum, tabletype_compare_caption } from "@/constants";
import { SearchSupportContext } from "@/contexts";
import { Fragment, useContext } from "react";

export default function CompareTables() {
  const { compareTable, openCollapseCompSection, setOpenCollapseCompSection } =
    useContext(SearchSupportContext);
  return (
    <div
      className="sm:w-8/12 w-full overflow-x-auto 
        flex flex-col space-y-2"
    >
      {Object.keys(compareTable).map((tabletype) => {
        if (compareTable[tabletype].length === 0)
          return <Fragment key={`${tabletype}-comp`}></Fragment>;
        return (
          <div
            className="justify-start flex flex-col"
            key={`${tabletype}-comp`}
          >
            <button
              className="p-2 bg-sky-300 hover:bg-sky-700 rounded-lg text-black"
              onClick={() => {
                if (openCollapseCompSection === tabletype) {
                  setOpenCollapseCompSection("" as AETableTypeEnum);
                  return;
                }
                setOpenCollapseCompSection(tabletype as AETableTypeEnum);
              }}
            >
              {tabletype_compare_caption[tabletype as AETableTypeEnum]}
            </button>
            <div
              className={`
                ${openCollapseCompSection === tabletype ? "" : "hidden"}
                `}
            >
              <Table {...{ content: compareTable, keyname: tabletype }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
