import { IBaseTitleContent, ITableNoHead } from "@/types";
import { Fragment, useId } from "react";
import { Table } from "../table";
import { VerToolbar } from "./ver-toolbar";

const pattern =
  /<title>(.*?)<\/title>|<tableplaceholder\/>-(\d+)|<\/title>\n+(.*?)\n+<title>/g;

function splitContents(input: string) {
  const result = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(input)) !== null) {
    const matchStart = match.index;

    // Capture content before this match
    if (matchStart > lastIndex) {
      const content = input.slice(lastIndex, matchStart).trim();
      if (content) result.push([content, "tag"]);
    }

    if (match[1]) {
      // Matched a <title>...</title>
      result.push([match[1].trim(), "title"]);
    } else if (match[2]) {
      // Matched a <tableplaceholder/>-number
      result.push([match[2], "tableid"]);
    } else if (match[3]) {
      result.push([match[3], "content"]);
    }

    lastIndex = pattern.lastIndex;
  }

  // Capture any content after the last tag
  const remaining = input.slice(lastIndex).trim();
  if (remaining) {
    result.push([remaining, "tag"]);
  }
  return result;
}

function rearrangeTables(tables: ITableNoHead[]) {
  const sorted = [...tables].sort((a, b) => a["id"] - b["id"]);
  const map: { [key: number]: ITableNoHead } = {};
  sorted.forEach((item, index: number) => {
    map[index] = item;
  });

  return map;
}

function GeneralSection({
  title,
  section,
  tables,
  hasCompareVer = false,
  verToolSecs = [],
}: {
  title: string;
  section?: IBaseTitleContent;
  tables?: ITableNoHead[];
  hasCompareVer?: boolean;
  verToolSecs?: string[];
}) {
  const id = useId();
  const contents_tags = splitContents(section!.content || "") || [];
  const idx_tables = rearrangeTables(tables || []) || {};

  return (
    <Fragment key={id}>
      <hr />
      <div className="flex flex-col space-y-2">
        {contents_tags.length !== 0 && (
          <div className="flex flex-col justify-between">
            <h2 className="text-xl text-emerald-200">{title}</h2>
            {hasCompareVer && (
              <VerToolbar
                fdaSections={verToolSecs!}
                reloadCallback={async () => {}}
              />
            )}
          </div>
        )}
        {contents_tags.length !== 0 &&
          contents_tags.map((c, idx) => {
            if (c[1] === "title") {
              return (
                <h3 key={`${id}-${idx}`} className="text-lg text-emerald-400">
                  {c[0]}
                </h3>
              );
            } else if (c[1] === "tag") {
              const newtext = c[0]
                .replace(/<title\s*>/gi, "")
                .replace(/<\/title\s*>/gi, "")
                .trim();
              return <div key={`${id}-${idx}`}>{newtext}</div>;
            } else if (c[1] === "content") {
              const newtext = c[0]
                .replace(/<title\s*>/gi, "")
                .replace(/<\/title\s*>/gi, "")
                .trim();
              return (
                <div key={`${id}-${idx}`} className="text-emerald-300">
                  {newtext}
                </div>
              );
            } else if (c[1] === "tableid") {
              if (Object.keys(idx_tables).length === 0) return <></>;
              return (
                <div key={`${id}-${idx}-${c[1]}`} className="flex flex-col">
                  <caption className="flex justify-start text-left text-md text-emerald-500">
                    {idx_tables[Number(c[0])]!.caption ?? ""}
                  </caption>
                  <div className="overflow-x-auto">
                    <Table
                      {...{ ...idx_tables[Number(c[0])], keyname: "table" }}
                    />
                  </div>
                </div>
              );
            }
          })}
      </div>
    </Fragment>
  );
}

export { GeneralSection };
