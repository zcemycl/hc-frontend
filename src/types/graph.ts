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
