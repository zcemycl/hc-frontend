import { IFdaLabelRef } from "./fdalabel";

export interface IBundleConfig {
  name: string;
  description: string;
}

export interface IBundle {
  id: string;
  name: string;
  description: string;
  fdalabels: IFdaLabelRef[];
}
