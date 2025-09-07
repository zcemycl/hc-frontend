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
import { ARROW_ICON_URI } from "@/icons/bootstrap";
import { useRouter } from "next/navigation";
import { useApiHandler, useDiscoveryGraph } from "@/hooks";
import { PaginationBar2 } from "@/components";
import {
  MoveDelBtn,
  BundleBoxHeader,
  LoaderComponentWrapper,
  BundleBoxItem,
  NoBundleBox,
  BundleHeader,
  CandidateHeader,
  NoCandidateBox,
} from "./components";

export default function BundleTab() {
  const { userId } = useAuth();
  const { handleResponse } = useApiHandler();
  const router = useRouter();
  const [loadingCountLocal, setLoadingCountLocal] = useState(0);
  const isLoadingLocal = loadingCountLocal > 0;

  const { withGenericLoading } = useLoader();
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

  const withLoadingLocal = async <T,>(fn: () => Promise<T>): Promise<T> => {
    return withGenericLoading(fn, setLoadingCountLocal);
  };

  const nodesToBundle = useMemo(() => {
    return multiSelectNodes.filter((v: INode) => v.group === "p");
  }, [multiSelectNodes]);

  const fetchBundlesCallback = useCallback(async () => {
    const tmpBundlesRes = await withLoadingLocal(() =>
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
    <LoaderComponentWrapper genericIsLoading={isLoadingLocal}>
      <div
        className={`absolute
        left-0 right-0 top-0 bottom-0
        self-end
        space-y-2
        overflow-y-auto
        w-full h-full
        transition
        ${
          tab === GraphTabEnum.bundle
            ? "opacity-100 z-10 delay-200"
            : "opacity-0 z-0 duration-200"
        }
        `}
      >
        <CandidateHeader
          {...{
            reload_callback: () => {
              setMultiSelectNodes([]);
              net.selectNodes([]);
            },
          }}
        />
        <div className="flex flex-wrap gap-2 content-start bg-amber-500 rounded-lg p-2">
          {nodesToBundle.length === 0 ? (
            <NoCandidateBox />
          ) : (
            nodesToBundle.map((v: INode, idx: number) => {
              return (
                <MoveDelBtn
                  key={`${v.label}-${v.group}`}
                  {...{
                    node: v,
                    idx,
                    click_callback: (vid) => {
                      move_network(net, vid);
                      trace_node_callback(vid, net);
                    },
                    del_callback: (vid, idx) => {
                      const newMultiSelect = structuredClone(
                        multiSelectNodes,
                      ).filter((v: INode) => v.id !== vid);
                      const newMultiSelectIds = newMultiSelect.map(
                        (n: INode) => n.id,
                      );
                      const tmpL = newMultiSelect.length;
                      move_network(net, newMultiSelectIds[tmpL - 1]);
                      net.selectNodes(newMultiSelectIds);
                      trace_node_callback(newMultiSelectIds[tmpL - 1], net);
                      setMultiSelectNodes([...newMultiSelect]);
                    },
                  }}
                />
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
        <BundleHeader
          {...{
            add_callback: () => setOpenBundleModal(true),
          }}
        />

        {bundles.length === 0 ? (
          <NoBundleBox />
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
                <BundleBoxHeader
                  {...{
                    bundle: v,
                    add_callback: async (bundle) => {
                      const tnSet = new Set();
                      bundle.fdalabels.forEach((f) => tnSet.add(f.tradename));
                      nodesToBundle.forEach((n: INode) => tnSet.add(n.label));
                      const newTradenames = Array.from(tnSet);
                      const patchBundleResult = await withLoadingLocal(() =>
                        patchBundleByIdv2(v.id, {
                          tradenames: newTradenames as string[],
                        }),
                      );
                      handleResponse(patchBundleResult);
                      if (!patchBundleResult.success) return;
                      await fetchBundlesCallback();
                    },
                    search_callback: async (bundle) => {
                      router.push(`/search?bundleId=${bundle.id}`);
                    },
                    del_callback: async (bundle) => {
                      const deleteBundleResult = await withLoadingLocal(() =>
                        deleteBundleByIdv2(bundle.id),
                      );
                      handleResponse(deleteBundleResult);
                      if (!deleteBundleResult.success) return;
                      await fetchBundlesCallback();
                    },
                  }}
                />
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
                      <BundleBoxItem
                        key={f.setid}
                        {...{
                          fdalabelRef: f,
                          bundle: v,
                          del_callback: async (fref, bref) => {
                            const newTradenames = bref.fdalabels
                              .filter(
                                (f_: IFdaLabelRef) =>
                                  f_.tradename !== fref.tradename,
                              )
                              .map((f_: IFdaLabelRef) => f_.tradename);
                            console.log(newTradenames);
                            const patchBundleResult = await withLoadingLocal(
                              () =>
                                patchBundleByIdv2(bref.id, {
                                  tradenames: newTradenames as string[],
                                }),
                            );
                            handleResponse(patchBundleResult);
                            if (!patchBundleResult.success) return;
                            await fetchBundlesCallback();
                          },
                        }}
                      />
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
    </LoaderComponentWrapper>
  );
}
