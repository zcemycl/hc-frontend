"use client";

import { DiscoveryContext, useAuth, useLoader } from "@/contexts";
import VisPanel from "./vis-panel";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IEdge,
  INode,
  IFlagAttrs,
  IBundleConfig,
  IBundle,
  IVisibilityMap,
} from "@/types";
import { EditBundleModal, Modal, ProtectedRoute } from "@/components";
import {
  defaultBundleConfig,
  GraphDirectionEnum,
  GraphTabEnum,
  GraphTypeEnum,
  toggleOptions,
} from "@/constants";
import { Network } from "vis-network";
import { useDbsHealth, useApiHandler } from "@/hooks";
import { NODE_MINUS_ICON_URI, NODE_PLUS_ICON_URI } from "@/icons/bootstrap";
import {
  createBundleByUserIdv2,
  fetchBundlesByUserIdv2,
  fetchBundlesCountByUserIdv2,
} from "@/http/backend";
import { useSearchParams } from "next/navigation";

export default function Discovery() {
  const { withGenericLoading } = useLoader();
  const { handleResponse } = useApiHandler();
  const searchParams = useSearchParams();
  const { userId } = useAuth();
  const { isNeo4JHealthy, neo4jHealthMsg } = useDbsHealth();
  // visjs handler obects
  const visJsRef = useRef<HTMLDivElement>(null);
  const visToolBarRef = useRef<HTMLDivElement>(null);
  const [net, setNet] = useState<Network | null>(null);
  // graph toolbar open
  const [openToolBar, setOpenToolBar] = useState<boolean>(
    searchParams.get("therapeutic_area") !== undefined,
  );
  const nPerPage = 5;
  const [loadingCountLocal, setLoadingCountLocal] = useState(0);
  const isLoadingLocal = loadingCountLocal > 0;
  // bundle tab
  const [openBundleModal, setOpenBundleModal] = useState<boolean>(false);
  const [bundleConfig, setBundleConfig] = useState<IBundleConfig>({
    ...defaultBundleConfig,
  });
  const [bundles, setBundles] = useState<IBundle[]>([]);
  const [bundlesCount, setBundlesCount] = useState<number>(0);
  const [pageNBundles, setPageNBundles] = useState(0);
  // filter search term
  const [term, setTerm] = useState<string>(
    searchParams.get("product_name") ?? "",
  );
  // current tab name
  const [tab, setTab] = useState<GraphTabEnum>(
    searchParams.get("therapeutic_area")
      ? searchParams.get("product_name")
        ? GraphTabEnum.filters
        : GraphTabEnum.initialisation
      : GraphTabEnum.information,
  );
  // node path to drug
  const [path, setPath] = useState<string[]>([]);
  // all nodes and edges from fetch graph
  const [nodes, setNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);
  const [dNodes, setDNodes] = useState<any>(null);
  const [dEdges, setDEdges] = useState<any>(null);
  const [hiddenAll, setHiddenAll] = useState<boolean>(false);
  const [hiddenType, setHiddenType] = useState<IVisibilityMap>(() =>
    Object.fromEntries(toggleOptions.map((opt) => [opt.key, false])),
  );
  const [hiddenNodes, setHiddenNodes] = useState<IVisibilityMap>(() =>
    Object.fromEntries(nodes.map((node) => [node.id, false])),
  );
  // for info tab displaying chain
  const [selectedNodes, setSelectedNodes] = useState<INode[]>([]);
  // for multi select nodes for drugs
  const [multiSelectNodes, setMultiSelectNodes] = useState<INode[]>([]);
  const [prevSignal, setPrevSignal] = useState<string>("False");
  // for flag tab, including ta names, max no of nodes, etc.
  const [flagAttrs, setFlagAttrs] = useState<IFlagAttrs>({
    name: searchParams.get("therapeutic_area") ?? "Neoplasms",
    numNodes: 100,
    offset: 0,
    maxLevel: 6,
  });
  // therapeutic area id for search
  const initTAId = searchParams.get("therapeutic_area_id") ?? null;
  // for settings tab
  const [settings, defineSettings] = useState<any>({
    graph_type: GraphTypeEnum.radial,
    graph_direction: GraphDirectionEnum.leftright,
    enabled_physics: true,
    physics_stabilisation: true,
  });

  const withLoadingLocal = async <T,>(fn: () => Promise<T>): Promise<T> => {
    return withGenericLoading(fn, setLoadingCountLocal);
  };

  useEffect(() => {
    setSelectedNodes([]);
    setMultiSelectNodes([]);
    setHiddenAll(false);
    setHiddenType(
      Object.fromEntries(toggleOptions.map((opt) => [opt.key, false])),
    );
    setHiddenNodes(Object.fromEntries(nodes.map((node) => [node.id, false])));
  }, [nodes]);

  useEffect(() => {
    if (!net || !visToolBarRef.current) return;
    console.log("recenter... ");
    const pos = net.getViewPosition();
    const { width: offsetx } = (
      visToolBarRef.current as any
    ).getBoundingClientRect();

    const directionX = openToolBar ? -1 : 1;
    const offset = { x: (directionX * offsetx) / 2, y: 0 };

    net.moveTo({
      position: pos,
      offset,
      animation: true,
    });
  }, [openToolBar]);

  const fetchBundlesCallback = useCallback(async () => {
    const [tmpBundlesRes, tmpBundlesCount] = await withLoadingLocal(() =>
      Promise.all([
        fetchBundlesByUserIdv2(
          userId as number,
          nPerPage * pageNBundles,
          nPerPage,
        ),
        fetchBundlesCountByUserIdv2(userId as number),
      ]),
    );
    handleResponse(tmpBundlesRes);
    setBundles(tmpBundlesRes.data ?? []);
    handleResponse(tmpBundlesCount);
    setBundlesCount(tmpBundlesCount.data ?? 0);
    console.log("bundles", tmpBundlesRes.data ?? [], tmpBundlesCount);
  }, [userId, pageNBundles]);

  return (
    <ProtectedRoute>
      {/* LocalContext */}
      <DiscoveryContext.Provider
        value={{
          nPerPage,
          tab,
          setTab,
          openToolBar,
          setOpenToolBar,
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
          openBundleModal,
          setOpenBundleModal,
          bundleConfig,
          setBundleConfig,
          bundles,
          setBundles,
          bundlesCount,
          setBundlesCount,
          pageNBundles,
          setPageNBundles,
          term,
          setTerm,
          path,
          setPath,
          initTAId,
          loadingCountLocal,
          isLoadingLocal,
          fetchBundlesCallback,
          withLoadingLocal,
          hiddenAll,
          setHiddenAll,
          hiddenType,
          setHiddenType,
          hiddenNodes,
          setHiddenNodes,
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
            <EditBundleModal
              {...{
                isOpenModal: openBundleModal,
                setIsOpenModal: setOpenBundleModal,
                title: "Add Bundle",
                bundleConfig,
                setBundleConfig,
                submit_callback: async (bc: IBundleConfig) => {
                  if (bc.name.trim() === "") {
                    return;
                  }
                  const createBundleRes = await createBundleByUserIdv2(
                    userId as number,
                    bc,
                  );
                  handleResponse(createBundleRes);
                  if (!createBundleRes.success) return;
                  await fetchBundlesCallback();
                  setBundleConfig({ ...defaultBundleConfig });
                  setOpenBundleModal(false);
                },
              }}
            />
          </div>
        </section>
      </DiscoveryContext.Provider>
    </ProtectedRoute>
  );
}
