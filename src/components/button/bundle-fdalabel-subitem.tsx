import { IFdaLabel, IFdaLabelRef } from "@/types";
import { CompositeCorner } from "./composite-corner";

const BundleFdalabelSubItem = ({
  f,
  fdaClickCallback,
  fdaDelCallback,
}: {
  f: IFdaLabel | IFdaLabelRef;
  fdaClickCallback?: (s: string) => void;
  fdaDelCallback?: (s: string) => void;
}) => {
  return (
    <div
      className="px-2 bg-emerald-400 
                rounded-lg font-semibold 
                text-black
                hover:bg-emerald-600
                hover:scale-105 duration-200
                transition-all cursor-pointer"
      key={`bundle-drug-${f.setid}`}
    >
      <CompositeCorner
        {...{
          label: f.tradename,
          click_callback: fdaClickCallback
            ? () => fdaClickCallback!(f.setid as string)
            : () => {},
          del_callback: fdaDelCallback
            ? () => fdaDelCallback!(f.setid as string)
            : undefined,
        }}
      />
    </div>
  );
};

export { BundleFdalabelSubItem };
