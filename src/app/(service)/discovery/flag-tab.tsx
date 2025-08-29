import { GraphTabEnum } from "@/constants";
import { DiscoveryContext, useLoader } from "@/contexts";
import { fetchGraphDummyv2 } from "@/http/backend";
import { PLAY_FILL_ICON_URI } from "@/icons/bootstrap";
import { useApiHandler } from "@/hooks";
import { INode } from "@/types";
import { useContext, useState } from "react";

export default function FlagTab() {
  const { handleResponse } = useApiHandler();
  const { tab, flagAttrs, setFlagAttrs, term, setNodes, setEdges } =
    useContext(DiscoveryContext);
  const { withLoading, setIsDrawingGraph } = useLoader();
  const [tmpName, setTmpName] = useState(flagAttrs.name);
  const [limit, setLimit] = useState(flagAttrs.numNodes);
  const [skip, setSkip] = useState(flagAttrs.offset);
  const [maxLevel, setMaxLevel] = useState(flagAttrs.maxLevel);
  return (
    <div
      className={`absolute
                left-0 right-0 top-0 bottom-0
                self-end
                space-y-3
                overflow-y-auto
                w-full h-full
                transition
                p-5
                flex flex-col
                ${tab === GraphTabEnum.initialisation ? "opacity-100 z-10 delay-200" : "opacity-0 z-0 duration-200"}
                `}
    >
      <div className="basis-11/12 space-y-1">
        <h2 className="leading text-slate-300 font-bold">Therapeutic Area</h2>
        <input
          type="text"
          className="bg-white text-black w-full rounded-lg h-10 p-2"
          value={tmpName}
          onChange={(e) => {
            e.preventDefault();
            setTmpName(e.target.value);
          }}
        />
        <h2 className="leading text-slate-300 font-bold">Number of Nodes</h2>
        <input
          type="number"
          value={limit}
          className="bg-white text-black rounded-lg h-10 p-2"
          onChange={(e) => {
            e.preventDefault();
            setLimit(e.target.value);
          }}
        />
        <h2 className="leading text-slate-300 font-bold">Skip</h2>
        <input
          type="number"
          value={skip}
          className="bg-white text-black rounded-lg h-10 p-2"
          onChange={(e) => {
            e.preventDefault();
            setSkip(e.target.value);
          }}
        />
        <h2 className="leading text-slate-300 font-bold">Max Level</h2>
        <input
          type="number"
          value={maxLevel}
          min={1}
          max={5}
          className="bg-white text-black rounded-lg h-10 p-2"
          onChange={(e) => {
            e.preventDefault();
            setMaxLevel(e.target.value);
          }}
        />
      </div>
      <div className="basis-1/12 flex flex-row justify-end">
        <button
          className="bg-emerald-500
                    hover:bg-emerald-200 rounded-full 
                    h-full aspect-square
                    justify-end align-middle
                    content-center"
          onClick={async (e) => {
            e.preventDefault();
            setIsDrawingGraph(true);
            setFlagAttrs({
              name: tmpName,
              numNodes: limit,
              offset: skip,
              maxLevel: maxLevel,
            });
            console.log(`${limit} ${skip} ${tmpName} ${maxLevel}`);
            if (tmpName == "") return;
            const res = await withLoading(() =>
              fetchGraphDummyv2(tmpName as string, limit, skip, null, maxLevel),
            );
            handleResponse(res);
            if (!res.success) return;
            console.log(res);
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
            const final_all_nodes = all_nodes.map((obj) =>
              obj.label == flagAttrs.name ? { ...obj, fixed: true } : obj,
            );
            setNodes(final_all_nodes);
            setEdges([...res?.data?.links]);
          }}
        >
          <img src={PLAY_FILL_ICON_URI} className="w-full" alt="submit" />
        </button>
      </div>
    </div>
  );
}
