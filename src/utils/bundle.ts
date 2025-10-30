import { IBundle } from "@/types";

const confirm_bundle_purpose = (bundle: IBundle) => {
  let useFor: string = "Not In Use";
  if (bundle.annotations.length === 0 && bundle.fdalabels.length === 0) {
    useFor = "Not In Use";
  } else if (bundle.annotations.length === 0 && bundle.fdalabels.length > 0) {
    useFor = "Fdalabel";
  } else if (bundle.annotations.length > 0 && bundle.fdalabels.length === 0) {
    useFor = "Annotation";
  }
  return useFor;
};

export { confirm_bundle_purpose };
