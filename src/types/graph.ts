export interface INode {
  level?: number;
  group?: string;
  label: string;
  id: number;
}

export interface IEdge {
  from: number;
  to: number;
}
