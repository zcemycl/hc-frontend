import { MarkerType, type Node, type Edge } from "@xyflow/react";

const sizeFlowHandle = "15px";

const flowProOptions = { hideAttribution: true };

const flowNodeOrigin: [number, number] = [0.5, 0];

const defaultFlowEdgeStyle = {
  type: "directionEdge",
  data: { label: "" },
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

const initialFlowNodes: Node[] = [];
const initialFlowEdges: Edge[] = [];

export {
  initialFlowEdges,
  initialFlowNodes,
  flowNodeOrigin,
  flowProOptions,
  sizeFlowHandle,
  defaultFlowEdgeStyle,
};
