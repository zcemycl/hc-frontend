"use client";
import { useState, useId } from "react";

function SearchBar({
  conditionForMultiBars,
  query,
  setQuery,
}: {
  conditionForMultiBars: boolean;
  query: string[];
  setQuery: (s: string[]) => void;
}) {
  const id = useId();
  const [nSearch, setNSearch] = useState(1);

  return (
    <div className="flex flex-col flex-nowrap space-y-2 mb-2">
      {Array.from(
        {
          length: conditionForMultiBars ? nSearch : 1,
        },
        (_, i) => (
          <div
            key={`${id}-${i}`}
            className="flex flex-row 
                    space-x-1 items-center h-[2rem]"
          >
            <input
              type="search"
              id="search"
              name="search"
              data-testid="search-input"
              value={query[i]}
              key={i}
              onChange={(e) => {
                let qs = Array.from(query);
                qs[i] = e.currentTarget.value;
                setQuery(qs);
              }}
              className="w-full bg-gray-800 h-full
                      rounded border border-gray-700 
                      focus:border-indigo-500 focus:ring-2 
                      focus:ring-indigo-900 text-base outline-none 
                      text-gray-100 py-1 px-3 leading-8 transition-colors 
                      duration-200 ease-in-out"
            />
            <div
              className="flex flex-col
                      items-center justify-center content-center
                      space-y-0
                      h-full"
            >
              {conditionForMultiBars && (
                <button
                  className="w-[1rem] h-1/2 p-0 leading-[0px] m-0"
                  onClick={() => {
                    if (nSearch === 1) return;
                    setNSearch((prev) => prev - 1);
                    let qs = Array.from(query);
                    qs.splice(i, 1);
                    setQuery(qs);
                  }}
                >
                  -
                </button>
              )}
              {conditionForMultiBars && i === nSearch - 1 && (
                <button
                  className="w-[1rem] h-1/2 p-0 leading-[0px] m-0"
                  onClick={() => {
                    setNSearch((prev) => prev + 1);
                    setQuery(((prev: string[]) => {
                      return [...prev, ""];
                    }) as unknown as string[]);
                  }}
                >
                  +
                </button>
              )}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export { SearchBar };
