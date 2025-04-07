import { TypographyH2 } from "@/components";
import { useRouter } from "next/navigation";
import {
  addEdge,
  Background,
  ConnectionMode,
  OnConnect,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Node,
  type Edge,
  MarkerType,
  MiniMap,
} from "@xyflow/react";
import { createContext, useCallback, useEffect, useRef } from "react";

import "@xyflow/react/dist/style.css";
import TextNode from "./textNode";
import { NodeEdgeGraphContext } from "./context";
import CustomEdge from "./directionEdge";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
let id = 0;
const getId = () => `${id++}`;
const nodeOrigin = [0.5, 0];

const nodeTypes = {
  textNode: TextNode,
};

const edgeTypes = {
  directionEdge: CustomEdge,
};

export default function Component() {
  const reactFlowWrapper = useRef(null);
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (params) => {
      // console.log(params)
      // console.log(edges);
      const isEdgeSrcTargetExist = edges.some(
        (record) =>
          record.source === params.source && record.target === params.target,
      );
      if (isEdgeSrcTargetExist) return;
      let params_ = {
        ...params,
        type: "directionEdge",
        style: {
          width: "20px",
          height: "20px",
          stroke: "#90EE90",
          strokeWidth: 3,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: "#90EE90",
        },
      };
      setEdges((eds) => addEdge(params_, eds));
    },
    [edges],
  );

  useEffect(() => {
    console.log(nodes);
    console.log(edges);
  }, [edges]);

  return (
    <NodeEdgeGraphContext.Provider
      value={{
        nodes,
        setNodes,
      }}
    >
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div className="px-2 py-24 flex flex-col justify-center items-center align-center">
          <div
            className="sm:w-10/12 flex flex-col mt-8 
            w-full px-1 pt-5 pb-5 space-y-2 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center space-x-1">
                <TypographyH2>Clinical Trials Annotations</TypographyH2>
              </div>
              <button
                onClick={() => {
                  router.back();
                }}
                className="bg-purple-700 rounded p-2 
                text-white hover:bg-purple-800"
              >
                <img
                  src="https://icons.getbootstrap.com/assets/icons/arrow-return-left.svg"
                  alt="back"
                />
              </button>
            </div>
            <div
              className="h-[60vh] relative 
              border-purple-700 border-2 rounded-2xl"
              ref={reactFlowWrapper}
            >
              <div id="flow-toolkit" className="absolute top-0 right-0 z-10">
                <button
                  className="aspect-square rounded-full
                    w-10 h-10 items-center justify-center flex
                    bg-emerald-400 hover:bg-emerald-600
                    text-black font-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    const id = getId();
                    console.log(e);
                    const { clientX, clientY } = e;
                    // 'changedTouches' in e ? e.changedTouches[0] : e;
                    const newNode = {
                      id,
                      position: screenToFlowPosition({
                        x: clientX,
                        y: clientY,
                      }),
                      // type: 'output',
                      type: "textNode",
                      data: { label: `Node ${id}` },
                      origin: [0.5, 0.0] as [number, number],
                    };

                    setNodes((nds) => nds.concat(newNode as any));
                  }}
                >
                  <img
                    src="https://icons.getbootstrap.com/assets/icons/plus.svg"
                    alt="addnode"
                  />
                </button>
              </div>
              <ReactFlow
                colorMode="dark"
                className="w-full h-full inset-0 absolute z-0 rounded-2xl"
                style={{ backgroundColor: "#F7F9FB" }}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                fitViewOptions={{ padding: 2 }}
                connectionMode={ConnectionMode.Loose}
                nodeOrigin={nodeOrigin as [number, number]}
                minZoom={0.5}
              >
                <Background />
                <MiniMap nodeStrokeWidth={3} />
              </ReactFlow>
            </div>
          </div>
        </div>
      </section>
    </NodeEdgeGraphContext.Provider>
  );
}
