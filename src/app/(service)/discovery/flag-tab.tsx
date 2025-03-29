import { DiscoveryContext } from "@/contexts";
import { useContext, useState } from "react";

export default function FlagTab() {
  const { tab, flagAttrs, setFlagAttrs } = useContext(DiscoveryContext);
  const [tmpName, setTmpName] = useState(flagAttrs.name);
  const [limit, setLimit] = useState(flagAttrs.numNodes);
  const [skip, setSkip] = useState(flagAttrs.offset);
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
                ${tab === "init" ? "opacity-100 z-10 delay-200" : "opacity-0 z-0 duration-200"}
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
      </div>
      <div className="basis-1/12 flex flex-row justify-end">
        <button
          className="bg-emerald-500
                    hover:bg-emerald-200 rounded-full 
                    h-full aspect-square
                    justify-end align-middle
                    content-center"
          onClick={(e) => {
            e.preventDefault();
            setFlagAttrs({
              name: tmpName,
              numNodes: limit,
              offset: skip,
            });
            console.log(`${limit} ${skip} ${tmpName}`);
          }}
        >
          <img
            src="https://icons.getbootstrap.com/assets/icons/play-fill.svg"
            className="w-full"
            alt="submit"
          />
        </button>
      </div>
    </div>
  );
}
