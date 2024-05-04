"use client";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/contexts";

export const queryTypeMap = [
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

export default function Search() {
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("setid");
  const [isQueryTypeDropdownOpen, setIsQueryTypeDropdownOpen] = useState(false);
  useEffect(() => {
    console.log("search...");
  }, []);
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
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
              }}
              className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
