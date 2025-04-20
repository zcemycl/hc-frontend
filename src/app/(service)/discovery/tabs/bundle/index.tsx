"use client";

import { GraphTabEnum } from "@/constants";
import { DiscoveryContext, useAuth } from "@/contexts";
import { INode } from "@/types";
import { useContext, useEffect, useMemo, useState } from "react";
import { fetchBundlesByUserId } from "@/http/backend";

export default function BundleTab() {
  const { userId, isLoadingAuth, credentials } = useAuth();
  const { tab, multiSelectNodes, setMultiSelectNodes, visToolBarRef, net } =
    useContext(DiscoveryContext);
  const [bundles, setBundles] = useState([]);
  const nodesToBundle = useMemo(() => {
    return multiSelectNodes.filter((v: INode) => v.group === "p");
  }, [multiSelectNodes]);

  useEffect(() => {
    async function getData() {
      const tmpBundles = await fetchBundlesByUserId(userId as number, 0, 0);
      console.log(tmpBundles);
      setBundles(tmpBundles);
    }

    if (isLoadingAuth) return;
    if (credentials.length === 0) return;
    getData();
  }, [userId]);

  return (
    <div
      className={`absolute
        left-0 right-0 top-0 bottom-0
        self-end
        space-y-2
        overflow-y-auto
        w-full h-full
        transition
        p-5
        ${
          tab === GraphTabEnum.bundle
            ? "opacity-100 z-10 delay-200"
            : "opacity-0 z-0 duration-200"
        }
        `}
    >
      <h2 className="leading text-slate-300 font-bold">Candidates</h2>
      <div className="flex flex-wrap gap-2 content-start bg-amber-500 rounded-lg p-2">
        {nodesToBundle.length === 0 ? (
          <div className="text-black font-bold">
            Multi-Select Nodes via Ctrl+Click
          </div>
        ) : (
          nodesToBundle.map((v: INode, idx: number) => {
            return (
              <div
                key={`${v.label}-${v.group}`}
                className="flex items-center rounded-lg
                  truncate overflow-x-auto
                  bg-purple-400 hover:bg-purple-200
                  cursor-pointer
                  h-8 px-3 py-1 relative"
                onClick={(e) => {
                  e.preventDefault();
                  const targetNodeId = v.id;
                  const pos = net.getPositions([targetNodeId])[targetNodeId];
                  const { width: offsetx, height: offsety } = (
                    visToolBarRef.current as any
                  ).getBoundingClientRect();
                  const offset = { x: offsety > 60 ? -offsetx / 2 : 0, y: 0 };
                  net.moveTo({
                    position: pos,
                    offset: offset,
                    animation: true,
                  });
                }}
              >
                <div
                  className={`text-black font-medium whitespace-nowrap
                  transition-transform duration-1000`}
                >
                  {v.label}
                </div>
                <button
                  className="flex items-center justify-center
                      absolute right-0 top-0
                      rounded-full bg-red-400 
                      hover:bg-red-500 transition-colors"
                  aria-label={`Remove ${v.label}`}
                  onClick={(e) => {
                    e.preventDefault();
                    let newMultiSelect = structuredClone(multiSelectNodes);
                    newMultiSelect.splice(idx, 1);
                    setMultiSelectNodes([...newMultiSelect]);
                    // console.log(dNodes.get(v.id));
                    // dNodes.update({
                    //   id: v.id,
                    //   label: 'hello',
                    // })
                    // net.unselectAll();
                    net.selectNodes(newMultiSelect.map((v: INode) => v.id));
                  }}
                >
                  <img src="https://icons.getbootstrap.com/assets/icons/x-circle.svg" />
                </button>
              </div>
            );
          })
        )}
      </div>
      <hr className="mb-2 text-white" />
      <h2 className="leading text-slate-300 font-bold">Bundles</h2>
      {bundles.length === 0 ? (
        <div className="content-start bg-amber-500 rounded-lg p-2 text-black font-bold">
          No available bundles
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
