"use client";
import { ProtectedRoute, TypographyH2 } from "@/components";
import { useRouter } from "next/navigation";
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { useRef } from "react";

import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "0",
    type: "input",
    data: { label: "Node" },
    position: { x: 0, y: 50 },
  },
];
let id = 1;
const getId = () => `${id++}`;
const nodeOrigin = [0.5, 0];

function Component() {
  const reactFlowWrapper = useRef(null);
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const { screenToFlowPosition } = useReactFlow();
  return (
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
                    data: { label: `Node ${id}` },
                    origin: [0.5, 0.0] as [number, number],
                  };

                  setNodes((nds) => nds.concat(newNode as any));
                }}
              >
                +
              </button>
            </div>
            <ReactFlow
              className="w-full h-full inset-0 absolute z-0 rounded-2xl"
              style={{ backgroundColor: "#F7F9FB" }}
              nodes={nodes}
              onNodesChange={onNodesChange}
              fitView
              fitViewOptions={{ padding: 2 }}
              nodeOrigin={nodeOrigin as [number, number]}
            >
              <Background />
            </ReactFlow>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ReactFlowProvider>
        <Component />
      </ReactFlowProvider>
    </ProtectedRoute>
  );
}
