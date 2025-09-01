"use client";
import { useContext, useEffect } from "react";
import { DiscoveryContext, useLoader } from "@/contexts";
import { Network, DataInterfaceNodes, DataInterfaceEdges } from "vis-network";
import { DataSet } from "vis-data";
import { generateGraphOption } from "@/constants";
import { IEdge, INode } from "@/types";

const useDiscoveryGraph = () => {
  const { withLoading, isDrawingGraph, setIsDrawingGraph } = useLoader();
  const {
    setSelectedNodes,
    setMultiSelectNodes,
    nodes,
    edges,
    setDNodes,
    setDEdges,
    settings,
    visJsRef,
    visToolBarRef,
    setNet,
    neo4jHealthMsg,
    setPrevSignal,
    setPath,
  } = useContext(DiscoveryContext);

  const retrieve_path_nodes_edges = (targetNodeId: number) => {
    console.log("tracing path nodes edges");
    let pathEdges = [];
    let pathNodes = [targetNodeId];
    let currentNode = targetNodeId;

    while (true) {
      let parentEdge = edges.filter((v: IEdge) => v.to === currentNode)[0];
      if (!parentEdge) break;

      pathEdges.push(parentEdge.id);
      currentNode = parentEdge.from;
      pathNodes.push(currentNode);
    }
    return {
      pathEdges,
      pathNodes,
    };
  };

  const trace_node_path_with_color = (pathEdges: string[], net_: Network) => {
    console.log("tracing display");
    setPath((prev: string[]) => {
      console.log("prev path: ", prev);
      try {
        prev
          .filter((v) => !pathEdges.includes(v))
          .forEach((v) =>
            net_.updateEdge(v, {
              color: "white",
              width: 0.5,
            }),
          );
      } catch {}
      return pathEdges;
    });

    pathEdges.forEach((v) =>
      net_.updateEdge(v as string, { color: "lightgreen", width: 6 }),
    );
  };

  const setUpNetwork = () => {
    const tmpDNodes = new DataSet(nodes);
    const tmpDEdges = new DataSet(edges);
    setDNodes(tmpDNodes);
    setDEdges(tmpDEdges);
    const network =
      visJsRef.current &&
      new Network(
        visJsRef.current,
        {
          nodes: tmpDNodes as DataInterfaceNodes,
          edges: tmpDEdges as DataInterfaceEdges,
        },
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
        setMultiSelectNodes(nodes.filter((v: INode) => e.nodes.includes(v.id)));
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

        const { pathEdges, pathNodes } = retrieve_path_nodes_edges(nodeId);

        setSelectedNodes(nodes.filter((v: INode) => pathNodes.includes(v.id)));
        console.log(pathEdges);
        trace_node_path_with_color(pathEdges, network);
      } else {
        // net?.releaseNode();
        // net?.redraw();
      }
    });
    // network?.on("oncontext", (e: any) => {
    //   setOpenSearchCanvas((prev: boolean) => {
    //     return !prev;
    //   })
    // });
    network.on("stabilizationProgress", (params: any) => {
      const widthFactor = params.iterations / params.total;
      setIsDrawingGraph(widthFactor < 1);
    });
    network.once("stabilizationIterationsDone", () => {
      setTimeout(function () {
        setIsDrawingGraph(false);
      }, 1500);
    });
    network?.on("initRedraw", (e: any) => {});
    // network?.on("beforeDrawing", (e: any) => {
    // })
    network?.on("afterDrawing", (e: any) => {});
    withLoading(() => setNet(network));
    withLoading(() => network?.fit());
    return network;
  };

  useEffect(() => {
    let network_: any = null;
    if (visJsRef.current) {
      setIsDrawingGraph(true);
      network_ = setUpNetwork();
      setPrevSignal(neo4jHealthMsg?.data);
    }
    return () => network_?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visJsRef, nodes, edges, settings]);

  return {
    setUpNetwork,
    retrieve_path_nodes_edges,
    trace_node_path_with_color,
  };
};

export { useDiscoveryGraph };
