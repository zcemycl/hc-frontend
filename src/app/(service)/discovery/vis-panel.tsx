"use client";
import React, { useEffect, useState, useContext } from "react";
import { useAuth, useLoader, DiscoveryContext } from "@/contexts";
import VisToolbar from "./vis-toolbar";
import { INode } from "@/types";
import { useRouter } from "next/navigation";
import { fetchGraphDummy } from "@/http/backend";
import { Spinner } from "@/components";
import { useDiscoveryGraph } from "@/hooks";

export default function VisPanel() {
  const { credentials, setIsAuthenticated, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const router = useRouter();
  const {
    setNodes,
    setEdges,
    flagAttrs,
    visJsRef,
    neo4jHealthMsg,
    visToolBarRef,
    term,
  } = useContext(DiscoveryContext);
  const [path, setPath] = useState<string[]>([]);
  const [prevSignal, setPrevSignal] = useState<string>("False");
  const { setUpNetwork } = useDiscoveryGraph({ setPath });

  useEffect(() => {
    if (credentials.length === 0) return;
    if (isLoadingAuth) return;
    async function getData(credentials: string) {
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        router.push("/logout");
      }
      setIsLoading(true);
      const res = await fetchGraphDummy(
        flagAttrs.name,
        flagAttrs.numNodes,
        flagAttrs.offset,
        term == "" ? null : term,
      );
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
        obj.label == flagAttrs.name ? { ...obj, fixed: true } : obj,
      );
      setNodes(final_all_nodes);
      setEdges([...res["links"]]);
      setIsLoading(false);
    }
    getData(credentials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  useEffect(() => {
    if (prevSignal === neo4jHealthMsg?.data) return;
    setIsLoading(true);
    let network_ = null;
    if (visJsRef.current && neo4jHealthMsg?.data === "True") {
      network_ = setUpNetwork();
    }
    setIsLoading(false);
    setPrevSignal(neo4jHealthMsg?.data);
    // return () => network_?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neo4jHealthMsg]);

  return (
    <div id="vis-panel" className="relative rounded-lg h-[78vh]">
      {isLoading && (
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
