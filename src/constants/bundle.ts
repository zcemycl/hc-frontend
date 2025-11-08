import { IBundleConfig } from "@/types";

const defaultBundleConfig = {
  name: "",
  description: "",
} as IBundleConfig;

enum BundleConnectEnum {
  FDALABEL = "fdalabel",
  ANNOTATION = "annotation",
}

export { defaultBundleConfig, BundleConnectEnum };
