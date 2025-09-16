"use client";
import { useContext, useEffect } from "react";
import { DiscoveryContext, useLoader } from "@/contexts";
import { Network, DataInterfaceNodes, DataInterfaceEdges } from "vis-network";
import { DataSet } from "vis-data";
import { generateGraphOption } from "@/constants";
import { IEdge, INode } from "@/types";

const useDiscoveryGraph = () => {
  const { withLoading, setIsDrawingGraph, isLoadingv2 } = useLoader();
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
    setPath,
  } = useContext(DiscoveryContext);

  const retrieve_path_nodes_edges = (targetNodeId: number | string) => {
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
    setPath((prev: string[]) => {
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

  const trace_node_callback = (nodeid: number | string, net_: Network) => {
    const { pathEdges, pathNodes } = retrieve_path_nodes_edges(nodeid);
    setSelectedNodes(nodes.filter((v: INode) => pathNodes.includes(v.id)));
    trace_node_path_with_color(pathEdges, net_);
  };

  const move_network = (net_: Network, nodeid: number | string) => {
    const pos = net_.getPositions([nodeid])[nodeid];
    const { width: offsetx, height: offsety } = (
      visToolBarRef.current as any
    ).getBoundingClientRect();
    const offset = { x: offsety > 60 ? -offsetx / 2 : 0, y: 0 };
    net_?.moveTo({
      position: pos,
      offset: offset,
      animation: true,
    });
  };

  const setUpNetwork = () => {
    const tmpDNodes = new DataSet(nodes);
    tmpDNodes.on("*", (event, properties, senderId) => {
      console.log(
        "event:",
        event,
        "properties:",
        properties,
        "senderId:",
        senderId,
      );
    });
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
        // make sure last selected node to be center
        const nodeId = e.nodes[e.nodes.length - 1];
        move_network(network, nodeId);
        trace_node_callback(nodeId, network);
      } else {
        // net?.releaseNode();
        // net?.redraw();
      }
    });
    // network?.on("oncontext", (e: any) => {
    // });
    network.on("stabilizationProgress", (params: any) => {
      const widthFactor = params.iterations / params.total;
      setIsDrawingGraph(widthFactor < 1);
    });
    network.once("stabilizationIterationsDone", () => {
      setTimeout(function () {
        setIsDrawingGraph(false);
        network.setOptions({ physics: false });
        network.stopSimulation();
      }, 1500);
    });
    network?.on("initRedraw", (e: any) => {});
    // network?.on("beforeDrawing", (e: any) => {
    // })
    network?.on("afterDrawing", (e: any) => {});
    withLoading(() => setNet(network));
    network.fit();
    return network;
  };

  useEffect(() => {
    let network_: Network | null = null;
    if (visJsRef.current && !isLoadingv2) {
      setIsDrawingGraph(true);
      network_ = setUpNetwork();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visJsRef, settings, isLoadingv2]);

  return {
    setUpNetwork,
    retrieve_path_nodes_edges,
    trace_node_path_with_color,
    move_network,
    trace_node_callback,
  };
};

export { useDiscoveryGraph };
