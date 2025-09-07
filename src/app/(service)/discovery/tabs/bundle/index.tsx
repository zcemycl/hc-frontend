"use client";

import { GraphTabEnum } from "@/constants";
import { DiscoveryContext, useAuth, useLoader } from "@/contexts";
import { IBundle, IFdaLabelRef, INode } from "@/types";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  deleteBundleByIdv2,
  fetchBundlesByUserIdv2,
  patchBundleByIdv2,
} from "@/http/backend";
import {
  ARROW_ICON_URI,
  MINUS_ICON_URI,
  PLUS_ICON_URI,
  RELOAD_ICON_URI,
  SEARCH_ICON_URI,
  X_CIRCLE_ICON_URI,
  X_ICON_URI,
} from "@/icons/bootstrap";
import { useRouter } from "next/navigation";
import { useApiHandler, useDiscoveryGraph } from "@/hooks";
import { switch_color_node, switch_hover_color_node } from "../../utils";
import { PaginationBar2 } from "@/components";

export default function BundleTab() {
  const { userId } = useAuth();
  const { handleResponse } = useApiHandler();
  const router = useRouter();
  const { withLoading } = useLoader();
  const {
    tab,
    multiSelectNodes,
    setMultiSelectNodes,
    net,
    setOpenBundleModal,
    bundles,
    setBundles,
  } = useContext(DiscoveryContext);
  const { move_network, trace_node_callback } = useDiscoveryGraph();
  const [pageN, setPageN] = useState(0);

  const nodesToBundle = useMemo(() => {
    return multiSelectNodes.filter((v: INode) => v.group === "p");
  }, [multiSelectNodes]);

  const fetchBundlesCallback = useCallback(async () => {
    const tmpBundlesRes = await withLoading(() =>
      fetchBundlesByUserIdv2(userId as number, 0, 5),
    );
    handleResponse(tmpBundlesRes);
    console.log(tmpBundlesRes.data ?? []);
    setBundles(tmpBundlesRes.data ?? []);
  }, [userId]);

  useEffect(() => {
    async function getData() {
      await fetchBundlesCallback();
    }
    getData();
  }, []);

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
      <div
        className="flex flex-row justify-start space-x-2
        content-center align-middle items-center"
      >
        <h2 className="leading text-slate-300 font-bold">Candidates</h2>
        <button
          onClick={(e) => {
            e.preventDefault();
            setMultiSelectNodes([]);
            net.selectNodes([]);
          }}
        >
          <img
            src={RELOAD_ICON_URI}
            className="rounded-full bg-purple-400 hover:bg-purple-600"
          />
        </button>
      </div>

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
                className={`flex items-center rounded-lg
                  truncate overflow-x-auto relative
                  ${switch_color_node(v.group as string)}
                  ${switch_hover_color_node(v.group as string)}
                  cursor-pointer
                  h-8 px-3 py-1`}
                onClick={(e) => {
                  e.preventDefault();
                  const targetNodeId = v.id;
                  move_network(net, targetNodeId);
                  trace_node_callback(targetNodeId, net);
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
                    net.selectNodes(newMultiSelect.map((v: INode) => v.id));
                  }}
                >
                  <img src={X_CIRCLE_ICON_URI} />
                </button>
              </div>
            );
          })
        )}
      </div>
      <hr className="mb-2 text-white" />
      {nodesToBundle.length > 0 && (
        <div className="w-full flex flex-row justify-center">
          <img
            className="
            bg-amber-300 rounded-full 
            animate-pulse w-5 h-5
            "
            src={ARROW_ICON_URI}
          />
        </div>
      )}
      <div className="w-full flex flex-row justify-start space-x-2 align-middle">
        <h2 className="leading text-slate-300 font-bold">Bundles</h2>
        <button
          className="w-5 h-5 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            setOpenBundleModal(true);
          }}
        >
          <img
            className="w-5 h-5 
            bg-emerald-300 rounded-full
            hover:bg-emerald-500
            "
            src={PLUS_ICON_URI}
          />
        </button>
      </div>

      {bundles.length === 0 ? (
        <div className="content-start bg-amber-500 rounded-lg p-2 text-black font-bold">
          No available bundles
        </div>
      ) : (
        bundles.map((v: IBundle) => {
          return (
            <div
              key={v.name}
              className="content-start
              flex flex-col
              bg-amber-500 hover:bg-amber-300
              rounded-lg group
              p-2 text-black font-bold
              hover:shadow-md
              hover:shadow-black
              "
            >
              <div
                id="bundle-summary"
                className="flex flex-row justify-between"
              >
                <div className="flex justfiy-start space-x-2">
                  <span>{v.name}</span>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      const tnSet = new Set();
                      v.fdalabels.forEach((f) => tnSet.add(f.tradename));
                      nodesToBundle.forEach((n: INode) => tnSet.add(n.label));
                      const newTradenames = Array.from(tnSet);
                      const patchBundleResult = await withLoading(() =>
                        patchBundleByIdv2(v.id, {
                          tradenames: newTradenames as string[],
                        }),
                      );
                      handleResponse(patchBundleResult);
                      if (!patchBundleResult.success) return;
                      await fetchBundlesCallback();
                    }}
                  >
                    <img
                      src={PLUS_ICON_URI}
                      className="rounded-sm border 
                      bg-emerald-400
                      border-transparent
                      hover:shadow-xl
                      hover:shadow-black
                      "
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/search?bundleId=${v.id}`);
                    }}
                  >
                    <img
                      src={SEARCH_ICON_URI}
                      className="rounded-sm border 
                      bg-transparent
                      border-transparent
                      hover:shadow-xl
                      hover:shadow-black"
                    />
                  </button>
                </div>

                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    const deleteBundleResult = await withLoading(() =>
                      deleteBundleByIdv2(v.id),
                    );
                    handleResponse(deleteBundleResult);
                    if (!deleteBundleResult.success) return;
                    await fetchBundlesCallback();
                  }}
                >
                  <img
                    src={X_ICON_URI}
                    className="rounded-full 
                    bg-red-500 hover:bg-red-700"
                  />
                </button>
              </div>
              <div
                className="flex flex-col space-y-1
                leading-relaxed transition-all origin-top
                ease-in-out duration-300
                overflow-hidden
                max-h-0
                group-hover:max-h-full
              "
              >
                {v.fdalabels.map((f: IFdaLabelRef) => {
                  return (
                    <div
                      key={f.setid}
                      className="bg-amber-100 
                      pl-2 py-1 rounded-md
                      text-xs flex flex-row
                      space-x-2
                      content-center items-center align-middle
                      "
                    >
                      <span>- {f.tradename}</span>
                      <button
                        className="rounded-full 
                          bg-red-500 hover:bg-red-300"
                        onClick={async (e) => {
                          e.preventDefault();
                          const newTradenames = v.fdalabels
                            .filter(
                              (f_: IFdaLabelRef) =>
                                f_.tradename !== f.tradename,
                            )
                            .map((f_: IFdaLabelRef) => f_.tradename);
                          console.log(newTradenames);
                          const patchBundleResult = await withLoading(() =>
                            patchBundleByIdv2(v.id, {
                              tradenames: newTradenames as string[],
                            }),
                          );
                          handleResponse(patchBundleResult);
                          if (!patchBundleResult.success) return;
                          await fetchBundlesCallback();
                        }}
                      >
                        <img src={MINUS_ICON_URI} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
      <PaginationBar2
        topN={1000}
        pageN={pageN}
        setPageN={setPageN}
        nPerPage={5}
        maxVisible={5}
      />
    </div>
  );
}
