"use client";

import { DiscoveryContext, useAuth } from "@/contexts";
import VisPanel from "./vis-panel";
import { useRef, useState } from "react";
import { IEdge, INode, IFlagAttrs, IBundleConfig, IBundle } from "@/types";
import { Modal, ProtectedRoute } from "@/components";
import {
  defaultBundleConfig,
  GraphDirectionEnum,
  GraphTabEnum,
  GraphTypeEnum,
} from "@/constants";
import { Network } from "vis-network";
import { useDbsHealth, useApiHandler } from "@/hooks";
import { NODE_MINUS_ICON_URI, NODE_PLUS_ICON_URI } from "@/icons/bootstrap";
import { createBundleByUserIdv2, fetchBundlesByUserIdv2 } from "@/http/backend";
import { useSearchParams } from "next/navigation";

export default function Discovery() {
  const { handleResponse } = useApiHandler();
  const searchParams = useSearchParams();
  const { userId } = useAuth();
  const { isNeo4JHealthy, neo4jHealthMsg } = useDbsHealth();
  const visJsRef = useRef<HTMLDivElement>(null);
  const visToolBarRef = useRef<HTMLDivElement>(null);
  const [net, setNet] = useState<Network | null>(null);
  const [openToolBar, setOpenToolBar] = useState<boolean>(
    searchParams.get("therapeutic_area") !== undefined,
  );
  const [openSearchCanvas, setOpenSearchCanvas] = useState<boolean>(false);
  const [openBundleModal, setOpenBundleModal] = useState<boolean>(false);
  const [bundleConfig, setBundleConfig] = useState<IBundleConfig>({
    ...defaultBundleConfig,
  });
  const [bundles, setBundles] = useState<IBundle[]>([]);
  const [term, setTerm] = useState<string>("");
  const [tab, setTab] = useState<GraphTabEnum>(
    searchParams.get("therapeutic_area")
      ? searchParams.get("product_name")
        ? GraphTabEnum.filters
        : GraphTabEnum.initialisation
      : GraphTabEnum.information,
  );
  const [path, setPath] = useState<string[]>([]);
  const [nodes, setNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);
  const [dNodes, setDNodes] = useState<any>(null);
  const [dEdges, setDEdges] = useState<any>(null);
  const [selectedNodes, setSelectedNodes] = useState<INode[]>([]);
  const [multiSelectNodes, setMultiSelectNodes] = useState<INode[]>([]);
  const [prevSignal, setPrevSignal] = useState<string>("False");
  const [oncePlusSignal, setOncePlusSignal] = useState<number>(0);
  const [flagAttrs, setFlagAttrs] = useState<IFlagAttrs>({
    name: searchParams.get("therapeutic_area")
      ? searchParams.get("therapeutic_area")!
      : "Neoplasms",
    numNodes: 100,
    offset: 0,
    maxLevel: 6,
  });
  const initTAId = searchParams.get("therapeutic_area_id") ?? null;
  const [settings, defineSettings] = useState<any>({
    graph_type: GraphTypeEnum.radial,
    graph_direction: GraphDirectionEnum.leftright,
    enabled_physics: true,
    physics_stabilisation: true,
  });

  return (
    <ProtectedRoute>
      <DiscoveryContext.Provider
        value={{
          tab,
          setTab,
          openToolBar,
          setOpenToolBar,
          openSearchCanvas,
          setOpenSearchCanvas,
          selectedNodes,
          setSelectedNodes,
          multiSelectNodes,
          setMultiSelectNodes,
          dNodes,
          setDNodes,
          nodes,
          setNodes,
          dEdges,
          setDEdges,
          edges,
          setEdges,
          flagAttrs,
          setFlagAttrs,
          settings,
          defineSettings,
          visJsRef,
          visToolBarRef,
          net,
          setNet,
          neo4jHealthMsg,
          prevSignal,
          setPrevSignal,
          oncePlusSignal,
          setOncePlusSignal,
          openBundleModal,
          setOpenBundleModal,
          bundleConfig,
          setBundleConfig,
          bundles,
          setBundles,
          term,
          setTerm,
          path,
          setPath,
          initTAId,
        }}
      >
        <section className="text-gray-400 bg-gray-900 body-font h-[81vh] sm:h-[89vh]">
          <div className="flex flex-col container pt-24 mx-auto px-10">
            <div className="sm:w-1/2 flex flex-col w-screen space-y-2">
              <h2 className="text-white text-lg mb-1 font-medium title-font space-x-1 flex flex-row">
                <span>Discovery</span>
                <div>
                  {isNeo4JHealthy ? (
                    <div className="bg-emerald-400 text-black font-bold w-fit p-2 rounded-xl">
                      <img src={NODE_PLUS_ICON_URI} alt="connected" />
                    </div>
                  ) : (
                    <div className="bg-red-400 text-black font-bold w-fit p-2 rounded-xl animate-pulse">
                      <img src={NODE_MINUS_ICON_URI} alt="connecting" />
                    </div>
                  )}
                </div>
              </h2>
            </div>
            <VisPanel />
            <Modal
              {...{
                title: "Add Bundle",
                isOpenModal: openBundleModal,
                setIsOpenModal: setOpenBundleModal,
              }}
            >
              <div
                className="flex flex-col space-y-2
                  px-2 sm:px-5
                  py-2 pb-5"
              >
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-white">Name</label>
                  <input
                    type="text"
                    value={bundleConfig.name}
                    className="bg-slate-300 text-black w-full
                          rounded-md p-2"
                    onChange={(e) => {
                      e.preventDefault();
                      setBundleConfig({
                        ...bundleConfig,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-white">Description</label>
                  <textarea
                    className="bg-slate-300 text-black w-full
                        rounded-md p-2 min-w-20"
                    value={bundleConfig.description}
                    onChange={(e) => {
                      e.preventDefault();
                      setBundleConfig({
                        ...bundleConfig,
                        description: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-emerald-300 hover:bg-emerald-500
                        rounded-lg
                        px-4 py-2
                        font-bold text-black"
                    onClick={async (e) => {
                      e.preventDefault();
                      console.log(bundleConfig);
                      console.log(userId);
                      if (bundleConfig.name.trim() === "") {
                        return;
                      }
                      const createBundleRes = await createBundleByUserIdv2(
                        userId as number,
                        bundleConfig,
                      );
                      handleResponse(createBundleRes);
                      if (!createBundleRes.success) return;
                      const tmpBundlesRes = await fetchBundlesByUserIdv2(
                        userId as number,
                        0,
                        5,
                      );
                      handleResponse(tmpBundlesRes);
                      setBundles(tmpBundlesRes.data ?? []);
                      setBundleConfig({ ...defaultBundleConfig });
                      setOpenBundleModal(false);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </section>
      </DiscoveryContext.Provider>
    </ProtectedRoute>
  );
}
