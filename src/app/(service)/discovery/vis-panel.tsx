"use client";
import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import { FASTAPI_URI } from "@/http/backend/constants";
import { useAuth } from "@/contexts";
import VisToolbar from "./vis-toolbar";
import {
  drug_product_group_graph_style,
  global_graph_edge_style,
  global_graph_node_style,
  therapeutic_area_group_graph_style,
} from "@/constants";
import { IEdge, INode } from "@/types";

export default function VisPanel() {
  const visJsRef = useRef<HTMLDivElement>(null);
  const { credentials } = useAuth();
  const [nodes, setNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);

  useEffect(() => {
    if (credentials.length === 0) return;
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      const API_URI = `http://localhost:4001/graph/`;
      console.log(API_URI);
      const response = await fetch(API_URI, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${credJson.AccessToken}`,
        },
      });
      const res = await response.json();
      setNodes([
        ...res["ta"].map((v: INode) => ({
          ...v,
          group: "ta",
        })),
        ...res["p"].map((v: INode) => ({
          ...v,
          group: "p",
        })),
      ]);
      setEdges([...res["links"]]);
      console.log(res);
    }
    getData(credentials);
  }, [credentials]);

  useEffect(() => {
    console.log(visJsRef);
    if (visJsRef.current) {
      const network =
        visJsRef.current &&
        new Network(
          visJsRef.current,
          { nodes, edges },
          {
            autoResize: true,
            edges: global_graph_edge_style,
            nodes: global_graph_node_style,
            interaction: { hover: true },
            groups: {
              ta: therapeutic_area_group_graph_style,
              p: drug_product_group_graph_style,
            },
          },
        );
      network?.fit();
    }
  }, [visJsRef, nodes, edges]);
  return (
    <div id="vis-panel" className="relative rounded-lg">
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
        <VisToolbar />
      </div>
    </div>
  );
}
