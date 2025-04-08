"use client";
import {
  Handle,
  Position,
  useNodeId,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import { useState } from "react";
import { sizeFlowHandle } from "@/constants";

export default function TextNode({
  data,
  isConnectable,
}: {
  data: any;
  isConnectable: boolean;
}) {
  const { setNodes } = useReactFlow();
  const [isEdit, setIsEdit] = useState(false);
  const nodeId = useNodeId();
  const nodeData = useNodesData(nodeId as string);
  const [nodeName, setNodeName] = useState(nodeData?.data.label as string);

  return (
    <div
      className="py-5 px-2
      hover:bg-purple-400
      bg-purple-500 rounded-lg"
    >
      <input
        id="text"
        name="text"
        className="bg-inherit nodrag 
          w-full h-full
          text-black font-bold
          align-middle text-center
        "
        value={nodeName}
        onChange={(e) => {
          setNodeName(e.target.value);
        }}
        onBlur={(e) => {
          setNodes((prev) => {
            const copy = prev.map((v) => {
              if (v.id !== nodeId) return v;
              let v_ = { ...v };
              v_.data.label = e.target.value;
              return v_;
            });
            return copy;
          });
        }}
      />
      {[
        ["top", Position.Top],
        ["bot", Position.Bottom],
        ["left", Position.Left],
        ["right", Position.Right],
      ].map((v) => (
        <Handle
          type="source"
          key={`handle-${v[0]}`}
          style={{
            width: sizeFlowHandle,
            height: sizeFlowHandle,
            backgroundColor: "#00d062",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url('https://icons.getbootstrap.com/assets/icons/plus.svg')`,
          }}
          position={v[1] as Position}
          id={v[0]}
          isConnectable={isConnectable}
          isValidConnection={(connection) =>
            connection.source !== connection.target
          }
        />
      ))}
    </div>
  );
}
