import { IFdaLabelRef } from "./fdalabel";

export interface IBundleConfig {
  name: string;
  description: string;
}

export interface IBundle {
  name: string;
  description: string;
  fdalabels: IFdaLabelRef[];
}
