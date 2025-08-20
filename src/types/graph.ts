import { ApiResult } from "./api";

export interface INode {
  level?: number;
  group?: string;
  label: string;
  id: number;
}

export interface IEdge {
  from: number;
  to: number;
  id?: string;
}

export interface IFlagAttrs {
  name?: string;
  numNodes?: number;
  offset?: number;
}

export interface ITa2PGraph {
  ta: INode[];
  p: INode[];
  links: IEdge[];
}

// API Result interfaces
export interface GraphResult extends ApiResult<ITa2PGraph> {}
