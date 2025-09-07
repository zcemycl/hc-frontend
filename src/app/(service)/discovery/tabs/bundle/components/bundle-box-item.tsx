import { MINUS_ICON_URI } from "@/icons/bootstrap";
import { IBundle, IFdaLabelRef } from "@/types";

export const BundleBoxItem = ({
  fdalabelRef,
  bundle,
  del_callback,
}: {
  fdalabelRef: IFdaLabelRef;
  bundle: IBundle;
  del_callback: (f: IFdaLabelRef, b: IBundle) => void;
}) => {
  return (
    <div
      key={fdalabelRef.setid}
      className="bg-amber-100 
            pl-2 py-1 rounded-md
            text-xs flex flex-row
            space-x-2
            content-center items-center align-middle
            "
    >
      <span>- {fdalabelRef.tradename}</span>
      <button
        className="rounded-full 
                bg-red-500 hover:bg-red-300"
        onClick={async (e) => {
          e.preventDefault();
          await del_callback(fdalabelRef, bundle);
        }}
      >
        <img src={MINUS_ICON_URI} />
      </button>
    </div>
  );
};
