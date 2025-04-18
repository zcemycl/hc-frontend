"use client";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { DiscoveryContext, useLoader } from "@/contexts";
import { Network } from "vis-network";
import { generateGraphOption } from "@/constants";
import { IEdge, INode } from "@/types";

const useDiscoveryGraph = ({
  setPath,
}: {
  setPath: Dispatch<SetStateAction<string[]>>;
}) => {
  const { isLoading, setIsLoading } = useLoader();
  const {
    setSelectedNodes,
    nodes,
    edges,
    settings,
    visJsRef,
    visToolBarRef,
    net,
    setNet,
    neo4jHealthMsg,
    setPrevSignal,
  } = useContext(DiscoveryContext);
  const setUpNetwork = () => {
    const network =
      visJsRef.current &&
      new Network(
        visJsRef.current,
        { nodes, edges },
        generateGraphOption(settings),
      );
    network?.once("beforeDrawing", function () {
      network?.moveTo({
        position: { x: 0, y: 0 },
        scale: 0.5,
        animation: true,
      });
    });
    network?.on("click", (e: any) => {
      console.log(e);
      if (e.nodes.length >= 1) {
        const nodeId = e.nodes[0];

        const { x, y } = network.getPositions([nodeId])[nodeId];
        const { width: offsetx, height: offsety } = (
          visToolBarRef.current as any
        ).getBoundingClientRect();
        const offset = { x: offsety > 60 ? -offsetx / 2 : 0, y: 0 };
        network?.moveTo({
          position: { x, y },
          offset,
          animation: true, // default duration is 1000ms and default easingFunction is easeInOutQuad.
        });

        let pathEdges = [];
        let pathNodes = [nodeId];
        let currentNode = nodeId;

        while (true) {
          let parentEdge = edges.filter((v: IEdge) => v.to === currentNode)[0];
          if (!parentEdge) break;

          pathEdges.push(parentEdge.id);
          currentNode = parentEdge.from;
          pathNodes.push(currentNode);
        }
        setSelectedNodes(nodes.filter((v: INode) => pathNodes.includes(v.id)));
        setPath((prev: string[]) => {
          try {
            prev
              .filter((v) => !pathEdges.includes(v))
              .forEach((v) =>
                network.updateEdge(v, {
                  color: "white",
                  width: 0.5,
                }),
              );
          } catch {}
          return pathEdges;
        });

        pathEdges.forEach((v) =>
          network.updateEdge(v as string, { color: "lightgreen", width: 6 }),
        );
      } else {
        net.releaseNode();
        net.redraw();
      }
    });
    // network?.on("oncontext", (e: any) => {
    //   setOpenSearchCanvas((prev: boolean) => {
    //     return !prev;
    //   })
    // });
    network?.on("initRedraw", (e: any) => {
      setIsLoading(true);
    });
    // network?.on("beforeDrawing", (e: any) => {
    //   setIsLoading(true);
    // })
    network?.on("afterDrawing", (e: any) => {
      setIsLoading(false);
    });
    setNet(network);
    network?.fit();
    return network;
  };

  useEffect(() => {
    let network_ = null;
    if (visJsRef.current && neo4jHealthMsg?.data === "True") {
      network_ = setUpNetwork();
      setPrevSignal(neo4jHealthMsg?.data);
    }
    return () => network_?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visJsRef, nodes, edges, settings]);

  return { setUpNetwork };
};

export { useDiscoveryGraph };
