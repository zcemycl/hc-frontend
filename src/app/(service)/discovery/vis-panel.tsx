"use client";
import React, { useEffect, useState, useContext } from "react";
import { useLoader, DiscoveryContext } from "@/contexts";
import VisToolbar from "./vis-toolbar";
import { INode } from "@/types";
import { fetchGraphDummyv2 } from "@/http/backend";
import { Spinner } from "@/components";
import { useDiscoveryGraph, useApiHandler } from "@/hooks";

export default function VisPanel() {
  const { handleResponse } = useApiHandler();
  const { isLoadingv2, withLoading, isDrawingGraph, setIsDrawingGraph } =
    useLoader();
  const {
    setNodes,
    setEdges,
    flagAttrs,
    visJsRef,
    neo4jHealthMsg,
    visToolBarRef,
    term,
    initTAId,
  } = useContext(DiscoveryContext);
  const { setUpNetwork } = useDiscoveryGraph();
  const [prevSignal, setPrevSignal] = useState<string>("False");

  const isDiscoveryLoading = isLoadingv2 || isDrawingGraph;

  useEffect(() => {
    async function getData() {
      const res = await withLoading(() =>
        fetchGraphDummyv2(
          flagAttrs.name,
          flagAttrs.numNodes,
          flagAttrs.offset,
          term == "" ? null : term,
          flagAttrs.maxLevel,
          initTAId,
        ),
      );
      handleResponse(res);
      if (!res.success) return;
      console.log(res);
      let all_nodes = [
        ...res?.data?.ta.map((v: INode) => ({
          ...v,
          group: "ta",
        })),
        ...res?.data?.p.map((v: INode) => ({
          ...v,
          group: "p",
        })),
      ];
      const final_all_nodes = all_nodes.map((obj) =>
        obj.label == flagAttrs.name ? { ...obj, fixed: true } : obj,
      );
      setNodes(final_all_nodes);
      setEdges([...res?.data?.links]);
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevSignal === neo4jHealthMsg?.data) return;
    let network_ = null;
    if (visJsRef.current && neo4jHealthMsg?.data === "True") {
      setIsDrawingGraph(true);
      network_ = setUpNetwork();
    }
    setPrevSignal(neo4jHealthMsg?.data);
    // return () => network_?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neo4jHealthMsg]);

  return (
    <div id="vis-panel" className="relative rounded-lg h-[78vh]">
      {isDiscoveryLoading && (
        <div
          className="absolute h-[78vh]
          z-20
          flex flex-col justify-center align-middle content-center
          top-1/2 -translate-y-1/2
          left-1/2 transform -translate-x-1/2"
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
        ref={visToolBarRef}
        id="vis-toolbar"
        className="absolute right-0 top-0
          pointer-events-none
          flex flex-col
          z-10
          space-y-2"
      >
        <VisToolbar />
      </div>
    </div>
  );
}
