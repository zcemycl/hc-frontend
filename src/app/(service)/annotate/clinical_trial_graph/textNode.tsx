"use client";

import styled from "styled-components";
import {
  Handle,
  Position,
  useNodeId,
  useNodesData,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { NodeEdgeGraphContext } from "./context";

const handleStyle = { left: 10 };
const sizeHandle = "15px";

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

  useEffect(() => {
    setNodes((prev) => {
      const copy = prev.map((v) => {
        if (v.id !== nodeId) return v;
        let v_ = { ...v };
        v.data.label = nodeName;
        return v_;
      });
      return prev;
    });
  }, [nodeName]);

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
        "
        value={nodeName}
        onChange={(e) => {
          setNodeName(e.target.value);
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
            width: sizeHandle,
            height: sizeHandle,
            backgroundColor: "#00d062",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url('https://icons.getbootstrap.com/assets/icons/plus.svg')`,
          }}
          position={v[1] as Position}
          id={v[0]}
          isConnectable={isConnectable}
        />
      ))}
    </div>
  );
}
