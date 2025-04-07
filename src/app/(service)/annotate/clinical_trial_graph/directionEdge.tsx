// "use client";
// import React from 'react';
// import {
//   getBezierPath,
//   useStore,
//   BaseEdge,
//   useReactFlow,
//   EdgeLabelRenderer,
//   type EdgeProps,
//   type ReactFlowState,
// } from '@xyflow/react';

// export type GetSpecialPathParams = {
//   sourceX: number;
//   sourceY: number;
//   targetX: number;
//   targetY: number;
// };

// export const getSpecialPath = (
//   { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
//   offset: number,
// ) => {
//   const centerX = (sourceX + targetX) / 2;
//   const centerY = (sourceY + targetY) / 2;

//   return `M ${sourceX} ${sourceY} Q ${centerX} ${
//     centerY + offset
//   } ${targetX} ${targetY}`;
// };

// export default function CustomEdge({
//     id,
//   source,
//   target,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   markerEnd,
// }: EdgeProps) {
//   const { setEdges } = useReactFlow();
//   const [edgePath, labelX, labelY] = getBezierPath({
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition,
//   });
//   const onEdgeClick = () => {
//     setEdges((edges) => edges.filter((edge) => edge.id !== id));
//     };
//   const isBiDirectionEdge = useStore((s: ReactFlowState) => {
//     const edgeExists = s.edges.some(
//       (e) =>
//         (e.source === target && e.target === source) ||
//         (e.target === source && e.source === target),
//     );

//     return edgeExists;
//   });

//   const edgePathParams = {
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition,
//   };

//   let path = '';

//   if (isBiDirectionEdge) {
//     path = getSpecialPath(edgePathParams, sourceX < targetX ? 25 : -25);
//   } else {
//     [path] = getBezierPath(edgePathParams);
//   }

//   return (
//     <>
//         <BaseEdge path={path} markerEnd={markerEnd} />
//         <EdgeLabelRenderer>
//       <div
//           className="button-edge__label nodrag nopan"
//           style={{
//             transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
//           }}
//         >
//           <button className="button-edge__button" onClick={onEdgeClick}>
//             ×
//           </button>
//         </div>
//       </EdgeLabelRenderer>
//     </>
//     );
// }

import React from "react";
import {
  BaseEdge,
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
}: EdgeProps) {
  const { setEdges } = useReactFlow();
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
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="
            absolute pointer-events-auto
            flex items-center content-center
            origin-center nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
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
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
