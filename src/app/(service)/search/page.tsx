"use client";
import { useState, useEffect } from "react";
import { ProtectedRoute, useAuth } from "@/contexts";
import { redirect } from "next/navigation";
import {
  fetchFdalabelByIndication,
  fetchFdalabelBySetid,
  fetchFdalabelByTradename,
} from "@/http/backend/protected";

const queryTypeMap = [
  {
    queryType: "setid",
    queryDisplayName: "Set ID",
  },
  {
    queryType: "tradename",
    queryDisplayName: "Trade Name",
  },
  {
    queryType: "indication",
    queryDisplayName: "Indication",
  },
];

interface IAdverseEffectTable {
  table: string[][];
}

interface IClinicalTrialTable {
  id: number;
  s3_bucket?: string;
  s3_key?: string;
  content: { table: string[][] };
}

interface IDrugInteraction {
  content: string;
  id: number;
  tag: string;
}

interface IFdaLabel {
  id?: number;
  setid?: string;
  tradename: string;
  indication?: string;
  pdf_link?: string;
  xml_link?: string;
  s3_bucket?: string;
  s3_key?: string;
  spl_effective_date: number;
  adverse_effect_tables?: IAdverseEffectTable[];
  clinical_trial_tables?: IClinicalTrialTable[];
  drug_interactions?: IDrugInteraction[];
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("setid");
  const [isQueryTypeDropdownOpen, setIsQueryTypeDropdownOpen] = useState(false);
  const [displayData, setDisplayData] = useState<IFdaLabel[]>([]);
  const [displayDataIndex, setDisplayDataIndex] = useState<number | null>(null);
  const { setIsAuthenticated, credentials } = useAuth();
  useEffect(() => {
    console.log("search...");
  }, []);
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
          </div>
          {displayData.length > 0 &&
            displayDataIndex != null &&
            [displayData[displayDataIndex]].map((each) => {
              return (
                <div
                  className="sm:w-1/2 flex flex-col w-screen"
                  key={each.setid}
                >
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
                  <h2 className="text-white text-lg mb-1 font-medium title-font">
                    INDICATIONS AND USAGE
                  </h2>
                  <p>{each.indication}</p>
                  {each.adverse_effect_tables!.length > 0 && (
                    <h2 className="text-white text-lg mb-1 font-medium title-font">
                      ADVERSSE REACTIONS
                    </h2>
                  )}
                  {each.adverse_effect_tables!.map((tabledata, tableid) => {
                    return (
                      <>
                        <table key={tableid}>
                          <tbody>
                            {tabledata.table.map((tablerow, rowid) => {
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
                <div
                  className="sm:w-1/2 flex flex-col w-screen p-10"
                  key={each.setid}
                >
                  <h2 className="text-white text-lg mb-1 font-medium title-font">
                    {each.tradename}
                  </h2>
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
