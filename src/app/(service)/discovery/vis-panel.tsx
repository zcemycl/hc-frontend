"use client";
import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import { useAuth, useLoader } from "@/contexts";
import VisToolbar from "./vis-toolbar";
import {
  drug_product_group_graph_style,
  global_graph_edge_style,
  global_graph_node_style,
  therapeutic_area_group_graph_style,
} from "@/constants";
import { IEdge, INode } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchGraphDummy } from "@/http/backend";
import { Spinner } from "@/components";

export default function VisPanel() {
  const visJsRef = useRef<HTMLDivElement>(null);
  const { credentials, setIsAuthenticated } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const [name, setName] = useState("Neoplasms");
  const [nodes, setNodes] = useState<INode[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (credentials.length === 0) return;
    setIsLoading(true);
    async function getData(credentials: string) {
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        router.push("/logout");
      }
      const res = await fetchGraphDummy(name);
      console.log(res);
      let all_nodes = [
        ...res["ta"].map((v: INode) => ({
          ...v,
          group: "ta",
        })),
        ...res["p"].map((v: INode) => ({
          ...v,
          group: "p",
        })),
      ];
      const final_all_nodes = all_nodes.map((obj) =>
        obj.label == name ? { ...obj, fixed: true } : obj,
      );
      setNodes(final_all_nodes);
      setEdges([...res["links"]]);
    }
    getData(credentials);
    setIsLoading(false);
  }, [credentials]);

  useEffect(() => {
    setIsLoading(true);
    if (visJsRef.current) {
      const network =
        visJsRef.current &&
        new Network(
          visJsRef.current,
          { nodes, edges },
          {
            autoResize: true,
            layout: {
              hierarchical: {
                direction: "LR",
                sortMethod: "directed",
              },
            },
            edges: global_graph_edge_style,
            nodes: global_graph_node_style,
            interaction: { hover: true },
            physics: {
              enabled: true,
              // wind:{
              //   x: 0, y: 1
              // },
              wind: {
                x: 1,
                y: 0,
              },
            },
            groups: {
              ta: therapeutic_area_group_graph_style,
              p: drug_product_group_graph_style,
            },
          },
        );
      network?.on("click", (e) => {
        if (e.nodes.length >= 1) {
          setSelectedNodes(nodes.filter((v) => e.nodes.includes(v.id)));
        }
      });
      network?.fit();
    }
    setIsLoading(false);
  }, [visJsRef, nodes, edges]);
  return (
    <div id="vis-panel" className="relative rounded-lg">
      {isLoading && (
        <div
          className="absolute h-[78vh]
          z-20
          flex flex-col justify-center align-middle content-center
          top-1/2 left-1/2 transform -translate-x-1/2"
        >
          <Spinner />
          <span className="sr-only">Loading...</span>
        </div>
      )}
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
      <div
        id="vis-toolbar"
        className="absolute right-0 top-0 
                    flex flex-col
                    z-10
                    space-y-2"
      >
        <VisToolbar {...{ selectedNodes }} />
      </div>
    </div>
  );
}
