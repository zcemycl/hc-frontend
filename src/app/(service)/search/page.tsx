"use client";
import { useState, useEffect, useRef } from "react";
import { ProtectedRoute, useAuth } from "@/contexts";
import { redirect } from "next/navigation";
import {
  fetchFdalabelByIndication,
  fetchFdalabelBySetid,
  fetchFdalabelByTradename,
  fetchFdalabelHistoryBySetid,
  fetchFdalabelCompareAdverseEffects,
} from "@/http/backend/protected";
import PaginationBar from "@/components/pagebar";
import { queryTypeMap } from "@/constants/search-query-type";
import { IFdaLabel, IFdaLabelHistory, ICompareAETable } from "@/types/fdalabel";
import { convert_datetime_to_date } from "@/utils";
import { TableCell, TableHeadCell } from "@/components/table";
import { TypographyH2 } from "@/components/typography";
import { DropDownBtn, DropDownItem, DropDownList } from "@/components/dropdown";

export default function Search() {
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("indication");
  const [isQueryTypeDropdownOpen, setIsQueryTypeDropdownOpen] = useState(false);
  const [displayData, setDisplayData] = useState<IFdaLabel[]>([]);
  const [displayHistoryData, setDisplayHistoryData] =
    useState<IFdaLabelHistory>({});
  const [displayDataIndex, setDisplayDataIndex] = useState<number | null>(null);
  const { setIsAuthenticated, credentials } = useAuth();
  const [setIdsToCompare, setSetIdsToCompare] = useState<Set<string>>(
    new Set(),
  );
  const [compareTable, setCompareTable] = useState<ICompareAETable>({
    table: [],
  });
  const [topN, setTopN] = useState(30);
  const [pageN, setPageN] = useState(0);
  const [nPerPage, setNPerPage] = useState(10);
  const refSearchResGroup = useRef(null);

  // show individual drug data
  useEffect(() => {
    let resp;
    if (credentials.length === 0) {
      setIsAuthenticated(false);
      redirect("/logout");
    }
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      resp = await fetchFdalabelHistoryBySetid(
        displayData[displayDataIndex as number].setid as string,
        credJson.AccessToken,
      );
      setDisplayHistoryData(resp);
      console.log(resp);
    }
    if (displayDataIndex != null) {
      getData(credentials);
    } else setDisplayHistoryData({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayDataIndex]);

  // refresh drug list when page is changed
  useEffect(() => {
    async function pageCallback(pageN: number) {
      setDisplayDataIndex(null);
      setCompareTable({ table: [] });
      let res, resp;
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        redirect("/logout");
      }
      const credJson = JSON.parse(credentials);
      if (queryType === "setid") {
        resp = await fetchFdalabelBySetid(
          query,
          credJson.AccessToken,
          topN,
          pageN * nPerPage,
          undefined,
        );
        setDisplayData([resp]);
        setDisplayDataIndex(0);
      } else if (queryType === "tradename") {
        resp = await fetchFdalabelByTradename(
          query,
          credJson.AccessToken,
          topN,
          pageN * nPerPage,
          undefined,
        );
        setDisplayData([resp]);
        setDisplayDataIndex(0);
      } else if (queryType === "indication") {
        resp = await fetchFdalabelByIndication(
          query,
          credJson.AccessToken,
          topN,
          pageN * nPerPage,
          undefined,
        );
        setDisplayData(resp);
      }
      console.log(resp);
      if (resp.detail?.error! === "AUTH_EXPIRED") {
        setIsAuthenticated(false);
        redirect("/logout");
      }
    }
    if (query !== "") {
      pageCallback(pageN);
      (refSearchResGroup.current as any).scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageN]);

  return (
    <ProtectedRoute>
      <section
        className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh] overflow-y-scroll"
        ref={refSearchResGroup}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10">
            <TypographyH2>Search</TypographyH2>
            <p className="leading-relaxed mb-5">Please enter your query.</p>
            <div className="relative mb-4">
              <input
                type="email"
                id="email"
                name="email"
                data-testid="login-email-input"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="py-1 flex justify-between items-center text-base">
              <div className="flex justify-start space-x-3">
                <label htmlFor="">Top N: </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  step="5"
                  value={topN}
                  className="border-2 border-indigo-500 rounded"
                  onChange={(e) => {
                    setTopN(parseInt(e.currentTarget.value));
                  }}
                />
              </div>
              <div>
                <DropDownBtn
                  onClick={() =>
                    setIsQueryTypeDropdownOpen(!isQueryTypeDropdownOpen)
                  }
                >
                  Query Type:{" "}
                  {
                    queryTypeMap.filter(
                      (each) => each.queryType === queryType,
                    )[0].queryDisplayName
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
                      setDisplayData([]);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <button
                data-testid="search-btn"
                onClick={async (e) => {
                  e.preventDefault();
                  setPageN(0);
                  setDisplayDataIndex(null);
                  setSetIdsToCompare(new Set());
                  setCompareTable({ table: [] });
                  let resp;
                  if (credentials.length === 0) {
                    setIsAuthenticated(false);
                    redirect("/logout");
                  }
                  const credJson = JSON.parse(credentials);
                  if (queryType === "setid") {
                    resp = await fetchFdalabelBySetid(
                      query,
                      credJson.AccessToken,
                      topN,
                      pageN * nPerPage,
                      undefined,
                    );
                    setDisplayData([resp]);
                    setDisplayDataIndex(0);
                  } else if (queryType === "tradename") {
                    resp = await fetchFdalabelByTradename(
                      query,
                      credJson.AccessToken,
                      topN,
                      pageN * nPerPage,
                      undefined,
                    );
                    setDisplayData([resp]);
                    setDisplayDataIndex(0);
                  } else if (queryType === "indication") {
                    resp = await fetchFdalabelByIndication(
                      query,
                      credJson.AccessToken,
                      topN,
                      pageN * nPerPage,
                      undefined,
                    );
                    setDisplayData(resp);
                  }
                  console.log(resp);
                  if (resp.detail?.error! === "AUTH_EXPIRED") {
                    setIsAuthenticated(false);
                    redirect("/logout");
                  }
                }}
                className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg w-full"
              >
                Submit
              </button>
              <div className={`flex flex-row space-x-1`}>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    console.log(setIdsToCompare);
                    let res, resp;
                    if (credentials.length === 0) {
                      setIsAuthenticated(false);
                      redirect("/logout");
                    }
                    const credJson = JSON.parse(credentials);
                    resp = await fetchFdalabelCompareAdverseEffects(
                      Array.from(setIdsToCompare),
                      credJson.AccessToken,
                    );
                    setCompareTable(resp);
                    console.log(resp);
                  }}
                  className={`text-black bg-green-600 
                  border-0
                  focus:outline-none hover:bg-green-700 
                  transition-all duration-200 ease-in-out
                  rounded
                  w-3/4
                  ${Array.from(setIdsToCompare).length > 1 ? "h-full py-2 px-6 text-lg" : "h-0 text-[0px]"}`}
                >
                  Compare Adverse Effects
                </button>
                <button
                  className={`
                  bg-red-600 
                  hover:bg-red-700
                  transition-all duration-200 ease-in-out
                  text-white
                  ${Array.from(setIdsToCompare).length > 1 ? "h-full py-2 px-6 w-1/4 text-lg" : "w-0 h-0 text-[0px]"}
                  rounded
                  border-0`}
                  onClick={() => {
                    setCompareTable({ table: [] });
                    setSetIdsToCompare(new Set());
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {compareTable.table?.length !== 0 && (
            <>
              <table className="border">
                <tbody>
                  {compareTable.table?.map((tablerow, rowid) => {
                    return (
                      <tr key={rowid}>
                        {tablerow.map((tdata, dataid) => {
                          return <TableCell key={dataid}>{tdata}</TableCell>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {displayData.length > 0 &&
            displayDataIndex != null &&
            [displayData[displayDataIndex]].map((each, idx) => {
              return (
                <div className="sm:w-1/2 flex flex-col w-screen" key={idx}>
                  <div className="flex justify-between">
                    <TypographyH2>{each.tradename}</TypographyH2>
                    {displayData.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDisplayDataIndex(null);
                        }}
                      >
                        Back
                      </button>
                    )}
                  </div>
                  <TypographyH2>{each.setid}</TypographyH2>
                  <TypographyH2>
                    {convert_datetime_to_date(each.spl_earliest_date)} -{" "}
                    {convert_datetime_to_date(each.spl_effective_date)}
                  </TypographyH2>
                  <TypographyH2>{each.manufacturer}</TypographyH2>
                  <p className="leading-relaxed">
                    XML source:{" "}
                    <a href={each.xml_link} target="_blank">
                      {each.xml_link}
                    </a>
                  </p>
                  <p className="leading-relaxed">
                    Download pdf:{" "}
                    <a href={each.pdf_link} target="_blank">
                      {each.pdf_link}
                    </a>
                  </p>

                  <TypographyH2>INDICATIONS AND USAGE</TypographyH2>
                  <p>{each.indication}</p>
                  {each.adverse_effect_tables!.length > 0 && (
                    <>
                      <TypographyH2>ADVERSE REACTIONS</TypographyH2>
                      {each.adverse_effect_tables!.map((tabledata, tableid) => {
                        return (
                          <>
                            <table key={tableid}>
                              <tbody>
                                {tabledata!.content.table!.map(
                                  (tablerow, rowid) => {
                                    return (
                                      <tr key={rowid}>
                                        {tablerow.map((tdata, dataid) => {
                                          return (
                                            <TableCell key={dataid}>
                                              {tdata}
                                            </TableCell>
                                          );
                                        })}
                                      </tr>
                                    );
                                  },
                                )}
                              </tbody>
                            </table>
                            <hr />
                          </>
                        );
                      })}
                    </>
                  )}
                  {each.drug_interactions!.length > 0 && (
                    <>
                      <TypographyH2>DRUG INTERACTIONS</TypographyH2>
                      {each.drug_interactions!.map((contentdata, contentid) => {
                        if (contentdata.tag === "title") {
                          return (
                            <h3
                              key={contentid}
                              className="text-white text-lg mb-1 font-medium title-font"
                            >
                              {contentdata.content}
                            </h3>
                          );
                        } else if (contentdata.tag === "content") {
                          return <p key={contentid}>{contentdata.content}</p>;
                        }
                      })}
                    </>
                  )}
                  {each.clinical_trials!.length > 0 && (
                    <>
                      <TypographyH2>CLINICAL TRIALS</TypographyH2>
                      {each.clinical_trials!.map((contentdata, contentid) => {
                        if (
                          contentdata.tag === "title" &&
                          contentdata.content !== "14 CLINICAL STUDIES"
                        ) {
                          return (
                            <h3
                              key={contentid}
                              className="text-white text-lg mb-1 font-medium title-font"
                            >
                              {contentdata.content}
                            </h3>
                          );
                        } else if (contentdata.tag === "content") {
                          return <p key={contentid}>{contentdata.content}</p>;
                        }
                      })}
                      {each.clinical_trial_tables!.map((tabledata, tableid) => {
                        return (
                          <>
                            <table key={tableid}>
                              <tbody>
                                {tabledata.content.table.map(
                                  (tablerow, rowid) => {
                                    return (
                                      <tr key={rowid}>
                                        {tablerow.map((tdata, dataid) => {
                                          return (
                                            <TableCell key={dataid}>
                                              {tdata}
                                            </TableCell>
                                          );
                                        })}
                                      </tr>
                                    );
                                  },
                                )}
                              </tbody>
                            </table>
                            <hr />
                          </>
                        );
                      })}
                    </>
                  )}
                  {/* show history */}
                  {displayDataIndex != null &&
                    displayHistoryData!.setids &&
                    displayHistoryData!.setids!.length > 1 && (
                      <>
                        <TypographyH2>HISTORY</TypographyH2>
                        <table>
                          <tbody>
                            <tr>
                              <TableHeadCell>Set ID</TableHeadCell>
                              <TableHeadCell>Manufacturer</TableHeadCell>
                              <TableHeadCell>SPL Earliest Date</TableHeadCell>
                              <TableHeadCell>SPL Effective Date</TableHeadCell>
                            </tr>
                            {displayHistoryData.setids.map((setid, idx) => {
                              return (
                                <tr key={idx}>
                                  <TableCell>{setid}</TableCell>
                                  <TableCell>
                                    {displayHistoryData.manufacturers![idx]}
                                  </TableCell>
                                  <TableCell>
                                    {convert_datetime_to_date(
                                      displayHistoryData.spl_earliest_dates![
                                        idx
                                      ],
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {convert_datetime_to_date(
                                      displayHistoryData.spl_effective_dates![
                                        idx
                                      ],
                                    )}
                                  </TableCell>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </>
                    )}
                </div>
              );
            })}

          {/* list of drugs */}
          {displayData.length > 0 && displayDataIndex === null && (
            <>
              {displayData.map((each, idx) => {
                return (
                  <>
                    <div
                      className="sm:w-1/2 flex flex-col w-screen p-10"
                      key={idx}
                    >
                      <div className="flex justify-between">
                        <TypographyH2>{each.tradename}</TypographyH2>
                        <input
                          type="checkbox"
                          checked={setIdsToCompare.has(each.setid as string)}
                          onClick={(e) => {
                            const ischecked = (e.target as HTMLInputElement)
                              .checked;
                            if (ischecked) {
                              setSetIdsToCompare((prev) =>
                                new Set(prev).add(each.setid as string),
                              );
                            } else {
                              setSetIdsToCompare(
                                (prev) =>
                                  new Set(
                                    Array.from(prev).filter(
                                      (x) => x != each.setid,
                                    ),
                                  ),
                              );
                            }
                          }}
                          readOnly={true}
                        />
                      </div>
                      <TypographyH2>
                        Initial US Approval Year:{" "}
                        {each.initial_us_approval_year}
                      </TypographyH2>
                      {each.distance && (
                        <TypographyH2>
                          Indication Proximity: {each.distance.toFixed(3)}
                        </TypographyH2>
                      )}
                      <p>{each.indication}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDisplayDataIndex(idx);
                        }}
                      >
                        View more...
                      </button>
                      <hr />
                    </div>
                  </>
                );
              })}
              <div className="flex justify-center space-x-1">
                <PaginationBar
                  topN={topN}
                  pageN={pageN}
                  nPerPage={nPerPage}
                  setPageN={(i: number) => {
                    setPageN(i);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
