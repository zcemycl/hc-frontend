"use client";

import { DiscoveryContext, useLoader } from "@/contexts";
import { useApiHandler, useDiscoveryGraph } from "@/hooks";
import { fetchGraphByProductsv2 } from "@/http/backend";
import { IBundle, IEdge, IFdaLabelRef, INode } from "@/types";
import { useContext, useEffect, useState } from "react";
import { SmallTabBar } from "./small-tabbar";

const fdaBundleTabOpts = [
  {
    key: "discovery",
    displayName: "Discovery Graph",
  },
  {
    key: "compare",
    displayName: "Adverse Reaction Comparison",
  },
  {
    key: "more",
    displayName: "More",
  },
];

const FdalabelContent = ({ bundle }: { bundle: IBundle | null }) => {
  const { handleResponse } = useApiHandler();
  const { isLoadingv2, withLoading, isDrawingGraph } = useLoader();
  const { setNodes, setEdges, visJsRef } = useContext(DiscoveryContext);
  useDiscoveryGraph();
  const [tabName, setTabName] = useState("discovery");

  useEffect(() => {
    async function getData() {
      const tradenames = Array.from(
        (bundle?.fdalabels.map((f: IFdaLabelRef) =>
          f.tradename.toLowerCase(),
        ) as string[]) || [],
      );
      if (tradenames.length === 0) return;
      const res = await withLoading(() => fetchGraphByProductsv2(tradenames));
      if (!res.success) handleResponse(res);
      let all_nodes = [
        ...res?.data?.ta.map((v: INode) => ({
          ...v,
          group: "ta",
        })),
        ...res?.data?.p.map((v: INode) => ({
          ...v,
          group: "p",
        })),
      ];
      const final_all_nodes = all_nodes;
      setNodes(final_all_nodes);
      setEdges([
        ...res?.data?.links.map((e_: IEdge) => {
          return {
            from: e_.from,
            to: e_.to,
            id: `from-${e_.from}-to-${e_.to}`,
          };
        }),
      ]);
    }
    getData();
  }, [bundle]);

  return (
    <div className="flex flex-col gap-2">
      <SmallTabBar
        {...{
          tabName,
          setTabName,
          options: fdaBundleTabOpts,
        }}
      />

      <div
        id="vis-panel"
        className={`relative rounded-lg h-[78vh] 
      ${tabName === "discovery" ? "" : "hidden"}`}
      >
        <div
          ref={visJsRef}
          style={{ height: "78vh", width: "100%" }}
          className="w-full h-full absolute
                    z-0
                    rounded-lg
                    border-2 border-solid
                    border-purple-700
                    left-0 right-0 top-0 bottom-0"
        />
      </div>
      {tabName === "compare" && <div>Hello</div>}
    </div>
  );
};

export { FdalabelContent };
