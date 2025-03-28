"use client";

import { ProtectedRoute, DiscoveryContext } from "@/contexts";
import VisPanel from "./vis-panel";
import { useRef, useState } from "react";
import { IEdge, INode, IFlagAttrs } from "@/types";
import { GraphDirectionEnum, GraphTypeEnum } from "@/constants";
import { Network } from "vis-network";
import { useDbsHealth } from "@/hooks";

export default function Discovery() {
  const { isNeo4JHealthy, neo4jHealthMsg } = useDbsHealth();
  const visJsRef = useRef<HTMLDivElement>(null);
  const [net, setNet] = useState<Network | null>(null);
  const [openToolBar, setOpenToolBar] = useState<boolean>(false);
  const [tab, setTab] = useState("info");
  const [nodes, setNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<INode[]>([]);
  const [prevSignal, setPrevSignal] = useState<string>("False");
  const [flagAttrs, setFlagAttrs] = useState<IFlagAttrs>({
    name: "Neoplasms",
    numNodes: 50,
    offset: 0,
  });
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
          selectedNodes,
          setSelectedNodes,
          nodes,
          setNodes,
          edges,
          setEdges,
          flagAttrs,
          setFlagAttrs,
          settings,
          defineSettings,
          visJsRef,
          net,
          setNet,
          neo4jHealthMsg,
          prevSignal,
          setPrevSignal,
        }}
      >
        <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
          <div className="flex flex-col container pt-24 mx-auto px-10">
            <div className="sm:w-1/2 flex flex-col w-screen space-y-2">
              <h2 className="text-white text-lg mb-1 font-medium title-font space-x-1 flex flex-row">
                <span>Discovery</span>
                <div>
                  {isNeo4JHealthy ? (
                    <div className="bg-emerald-400 text-black font-bold w-fit p-2 rounded-xl">
                      <img
                        src="https://icons.getbootstrap.com/assets/icons/node-plus.svg"
                        alt="connected"
                      />
                    </div>
                  ) : (
                    <div className="bg-red-400 text-black font-bold w-fit p-2 rounded-xl animate-pulse">
                      <img
                        src="https://icons.getbootstrap.com/assets/icons/node-minus.svg"
                        alt="connecting"
                      />
                    </div>
                  )}
                </div>
              </h2>
            </div>
            <VisPanel />
          </div>
        </section>
      </DiscoveryContext.Provider>
    </ProtectedRoute>
  );
}
