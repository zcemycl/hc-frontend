"use client";
import { useState, useEffect } from "react";
import { ProtectedRoute, useAuth } from "@/contexts";
import { redirect } from "next/navigation";
import {
  fetchFdalabelByIndication,
  fetchFdalabelBySetid,
  fetchFdalabelByTradename,
  fetchFdalabelHistoryBySetid,
  fetchFdalabelCompareAdverseEffects,
} from "@/http/backend/protected";
import { queryTypeMap } from "@/constants/search-query-type";
import { IFdaLabel, IFdaLabelHistory } from "@/types/fdalabel";
import { convert_datetime_to_date } from "@/utils";

interface ICompareAETable {
  table?: string[][];
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("setid");
  const [isQueryTypeDropdownOpen, setIsQueryTypeDropdownOpen] = useState(false);
  const [displayData, setDisplayData] = useState<IFdaLabel[]>([]);
  const [displayHistoryData, setDisplayHistoryData] =
    useState<IFdaLabelHistory>({});
  const [displayDataIndex, setDisplayDataIndex] = useState<number | null>(null);
  const { setIsAuthenticated, credentials } = useAuth();
  const [setIdsToCompare, setSetIdsToCompare] = useState<Set<string>>(
    new Set(),
  );
  const [compareTable, setCompareTable] = useState<ICompareAETable>({});

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
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh] overflow-y-scroll">
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10">
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              Search
            </h2>
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
            <div className="py-1 flex items-center text-base justify-end">
              <button
                // ref={refMenuBtn}
                data-collapse-toggle="navbar-dropdown"
                type="button"
                className="inline-flex items-center p-2 w-auto h-10 mr-1 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-dropdown"
                aria-expanded="false"
                onClick={() =>
                  setIsQueryTypeDropdownOpen(!isQueryTypeDropdownOpen)
                }
              >
                <span className="sr-only">Open main menu</span>
                Query Type:{" "}
                {
                  queryTypeMap.filter((each) => each.queryType === queryType)[0]
                    .queryDisplayName
                }
              </button>
            </div>
            <div
              className="flex w-full justify-end h-0"
              // ref={refDropDown}
            >
              <div
                className={`items-center z-10 justify-between w-auto transition-transform ${isQueryTypeDropdownOpen ? "scale-y-100" : "scale-y-0"}`}
                id="navbar-dropdown"
              >
                <ul className="flex flex-col p-2 md:p-0 mt-1 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse dark:bg-gray-800  dark:border-gray-700">
                  {queryTypeMap.map((keyValue) => {
                    return (
                      <li key={keyValue.queryType}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setQueryType(keyValue.queryType);
                            setIsQueryTypeDropdownOpen(false);
                          }}
                        >
                          {keyValue.queryDisplayName}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <button
              data-testid="search-btn"
              onClick={async (e) => {
                e.preventDefault();
                setDisplayDataIndex(null);
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
                  );
                  setDisplayData([resp]);
                  setDisplayDataIndex(0);
                  console.log(resp);
                } else if (queryType === "tradename") {
                  resp = await fetchFdalabelByTradename(
                    query,
                    credJson.AccessToken,
                  );
                  setDisplayData([resp]);
                  setDisplayDataIndex(0);
                  console.log(resp);
                } else if (queryType === "indication") {
                  resp = await fetchFdalabelByIndication(
                    query,
                    credJson.AccessToken,
                  );
                  setDisplayData(resp);
                  console.log(resp);
                }
              }}
              className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Submit
            </button>
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
              className="text-black bg-green-600 border-0 py-2 px-6 focus:outline-none hover:bg-green-700 rounded text-lg"
            >
              Compare Adverse Effects
            </button>
          </div>
          {compareTable.table?.length !== 0 && (
            <>
              <table>
                <tbody>
                  {compareTable.table?.map((tablerow, rowid) => {
                    return (
                      <tr key={rowid}>
                        {tablerow.map((tdata, dataid) => {
                          return <td key={dataid}>{tdata}</td>;
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
                    <h2 className="text-white text-lg mb-1 font-medium title-font">
                      {each.tradename}
                    </h2>
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

                  <h2 className="text-white text-lg mb-1 font-medium title-font">
                    {each.setid}
                  </h2>
                  <h2 className="text-white text-lg mb-1 font-medium title-font">
                    {convert_datetime_to_date(each.spl_earliest_date)} -{" "}
                    {convert_datetime_to_date(each.spl_effective_date)}
                  </h2>
                  <h2 className="text-white text-lg mb-1 font-medium title-font">
                    {each.manufacturer}
                  </h2>
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
                  {displayDataIndex != null &&
                    displayHistoryData!.setids &&
                    displayHistoryData!.setids!.length > 1 && (
                      <>
                        <h2 className="text-white text-lg mb-1 font-medium title-font">
                          HISTORY
                        </h2>
                        <table>
                          <tbody>
                            <tr>
                              <th>Set ID</th>
                              <th>Manufacturer</th>
                              <th>SPL Earliest Date</th>
                              <th>SPL Effective Date</th>
                            </tr>
                            {displayHistoryData.setids.map((setid, idx) => {
                              return (
                                <tr key={idx}>
                                  <td>{setid}</td>
                                  <td>
                                    {displayHistoryData.manufacturers![idx]}
                                  </td>
                                  <td>
                                    {convert_datetime_to_date(
                                      displayHistoryData.spl_earliest_dates![
                                        idx
                                      ],
                                    )}
                                  </td>
                                  <td>
                                    {convert_datetime_to_date(
                                      displayHistoryData.spl_effective_dates![
                                        idx
                                      ],
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </>
                    )}
                  <h2 className="text-white text-lg mb-1 font-medium title-font">
                    INDICATIONS AND USAGE
                  </h2>
                  <p>{each.indication}</p>
                  {each.adverse_effect_tables!.length > 0 && (
                    <h2 className="text-white text-lg mb-1 font-medium title-font">
                      ADVERSE REACTIONS
                    </h2>
                  )}
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
                                      return <td key={dataid}>{tdata}</td>;
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
                  {each.drug_interactions!.length > 0 && (
                    <h2 className="text-white text-lg mb-1 font-medium title-font">
                      DRUG INTERACTIONS
                    </h2>
                  )}
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
                  {each.clinical_trial_tables!.length > 0 && (
                    <h2 className="text-white text-lg mb-1 font-medium title-font">
                      CLINICAL TRIALS
                    </h2>
                  )}
                  {each.clinical_trial_tables!.map((tabledata, tableid) => {
                    return (
                      <>
                        <table key={tableid}>
                          <tbody>
                            {tabledata.content.table.map((tablerow, rowid) => {
                              return (
                                <tr key={rowid}>
                                  {tablerow.map((tdata, dataid) => {
                                    return <td key={dataid}>{tdata}</td>;
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <hr />
                      </>
                    );
                  })}
                </div>
              );
            })}
          {displayData.length > 0 &&
            displayDataIndex === null &&
            displayData.map((each, idx) => {
              return (
                <div className="sm:w-1/2 flex flex-col w-screen p-10" key={idx}>
                  <div className="flex justify-between">
                    <h2 className="text-white text-lg mb-1 font-medium title-font">
                      {each.tradename}
                    </h2>
                    <input
                      type="checkbox"
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
                                Array.from(prev).filter((x) => x != each.setid),
                              ),
                          );
                        }
                      }}
                    />
                  </div>

                  <h2 className="text-white text-lg mb-1 font-medium title-font">
                    {each.setid}
                  </h2>
                  <h2 className="text-white text-lg mb-1 font-medium title-font">
                    INDICATIONS AND USAGE
                  </h2>
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
              );
            })}
        </div>
      </section>
    </ProtectedRoute>
  );
}
