import { TypographyH2, BackBtn } from "@/components";
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
  MiniMap,
} from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";
import {
  defaultFlowEdgeStyle,
  flowProOptions,
  flowNodeOrigin,
  initialFlowEdges,
  initialFlowNodes,
} from "@/constants";

import "@xyflow/react/dist/style.css";
import TextNode from "./textNode";
import { NodeEdgeGraphContext } from "./context";
import CustomEdge from "./directionEdge";

let id = 0;
const getId = () => `${id++}`;

const nodeTypes = {
  textNode: TextNode,
};

const edgeTypes = {
  directionEdge: CustomEdge,
};

export default function Component() {
  const reactFlowWrapper = useRef(null);
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlowEdges);
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
        ...structuredClone(defaultFlowEdgeStyle),
      };
      setEdges((eds) => addEdge(params_, eds));
    },
    [edges],
  );

  const onConnectEnd = useCallback(
    (event: any, connectionState: any) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
          type: "textNode",
        } as Node;

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => {
          let ed_ = {
            id,
            source: connectionState.fromNode.id,
            target: id,
            ...structuredClone(defaultFlowEdgeStyle),
          };
          return eds.concat(ed_);
        });
      }
    },
    [screenToFlowPosition],
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
                <TypographyH2>Clinical Trials Graph Annotations</TypographyH2>
              </div>
              <BackBtn />
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
                onConnectEnd={onConnectEnd}
                proOptions={flowProOptions}
                fitView
                fitViewOptions={{ padding: 2 }}
                connectionMode={ConnectionMode.Loose}
                nodeOrigin={flowNodeOrigin as [number, number]}
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
