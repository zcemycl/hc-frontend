"use client";

import React, { useState } from "react";
import {
  BaseEdge,
  type Edge,
  EdgeLabelRenderer,
  getBezierPath,
  useInternalNode,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import { getEdgeParams } from "./utils";

export default function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(data?.label as string);
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) {
    return null;
  }
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );
  //   const [edgePath, labelX, labelY] = getBezierPath({
  //     sourceX,
  //     sourceY,
  //     sourcePosition,
  //     targetX,
  //     targetY,
  //     targetPosition,
  //   });

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
        onDoubleClick={(e) => {
          console.log("double click");
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="
            flex flex-col
            absolute pointer-events-auto
            items-center content-center
            origin-center nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <div
            className="
            flex flex-row space-x-2
          "
          >
            <button
              className="
            bg-red-300 text-black
            cursor-pointer
            rounded-full
            flex items-center content-center
            hover:bg-red-400
            hover:text-slate-300
            "
              onClick={onEdgeClick}
            >
              <img
                src="https://icons.getbootstrap.com/assets/icons/x.svg"
                alt="crossEdge"
              />
            </button>
            <button
              className="
            bg-sky-400 text-black
            cursor-pointer
            rounded-full
            flex items-center content-center
            hover:bg-sky-500
            hover:text-slate-300
            "
              onClick={(e) => {
                setIsEditable(!isEditable);
              }}
            >
              <img
                src="https://icons.getbootstrap.com/assets/icons/vector-pen.svg"
                alt="penEdge"
              />
            </button>
          </div>
          {(isEditable || label !== "") && (
            <input
              type="text"
              disabled={!isEditable}
              onChange={(e) => {
                setLabel(e.target.value);
              }}
              onBlur={(e) => {
                console.log(e.target.value);
                setEdges((prev) => {
                  const copy = prev.map((v) => {
                    if (v.id !== id) return v;
                    let v_ = { ...v } as Edge;
                    v_!.data!.label = e.target.value;
                    return v_;
                  });
                  return prev;
                });
              }}
              value={label}
              className="p-1
                bg-transparent
                text-shadow-xs
                text-white rounded-lg
                text-center align-middle"
            />
          )}
        </div>
      </EdgeLabelRenderer>
      <circle r="10" fill="#ff0073">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}
