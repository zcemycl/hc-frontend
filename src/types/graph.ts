import { ApiResult } from "./api";

export interface INode {
  level?: number;
  group?: string;
  label: string;
  id: number | string;
}

export interface IEdge {
  from: number | string;
  to: number | string;
  id?: string;
}

export interface IFlagAttrs {
  name?: string;
  numNodes?: number;
  offset?: number;
  maxLevel?: number;
}

export interface ITa2PGraph {
  ta: INode[];
  p: INode[];
  links: IEdge[];
}

export interface IVisibilityMap extends Record<string, boolean> {}

// API Result interfaces
export interface GraphResult extends ApiResult<ITa2PGraph> {}
