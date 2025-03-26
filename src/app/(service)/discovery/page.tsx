"use client";

import { ProtectedRoute } from "@/contexts";
import VisPanel from "./vis-panel";
import { DiscoveryContext } from "./context";
import { useState } from "react";
import { IEdge, INode } from "@/types";

export default function Discovery() {
  const [openToolBar, setOpenToolBar] = useState<boolean>(false);
  const [tab, setTab] = useState("info");
  const [name, setName] = useState("Neoplasms");
  const [nodes, setNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<INode[]>([]);
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
          name,
          setName,
          nodes,
          setNodes,
          edges,
          setEdges,
        }}
      >
        <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
          <div className="flex flex-col container pt-24 mx-auto px-10">
            <div className="sm:w-1/2 flex flex-col w-screen space-y-2">
              <h2 className="text-white text-lg mb-1 font-medium title-font">
                Discovery
              </h2>
            </div>
            <VisPanel />
          </div>
        </section>
      </DiscoveryContext.Provider>
    </ProtectedRoute>
  );
}
