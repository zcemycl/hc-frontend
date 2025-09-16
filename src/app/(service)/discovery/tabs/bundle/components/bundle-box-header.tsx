import {
  FLOWER_ICON_URI,
  PLUS_ICON_URI,
  SEARCH_ICON_URI,
  X_ICON_URI,
} from "@/icons/bootstrap";
import { IBundle } from "@/types";

export const BundleBoxHeader = ({
  bundle,
  add_callback,
  search_callback,
  del_callback,
  expand_callback,
}: {
  bundle: IBundle;
  add_callback: (bundle: IBundle) => void;
  search_callback: (bundle: IBundle) => void;
  del_callback: (bundle: IBundle) => void;
  expand_callback: (bundle: IBundle) => void;
}) => {
  let useFor = "Empty";
  if (!(bundle.annotations.length === 0 && bundle.fdalabels.length === 0)) {
    useFor = "";
  }
  return (
    <div id="bundle-summary" className="flex flex-row justify-between">
      <div
        className="flex justify-start space-x-2 basis-2/3 
        text-clip min-w-0"
      >
        <span
          className="basis-full whitespace-nowrap 
          flex-shrink-0 min-w-0 text-ellipsis space-x-2 flex
          items-center
          overflow-hidden"
        >
          {useFor === "" ? (
            <></>
          ) : (
            <span className="bg-red-500 rounded-lg px-3 py-1">{useFor}</span>
          )}
          <span>{bundle.name}</span>
        </span>
      </div>
      <div className="flex flex-row basis-1/3 justify-end space-x-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            expand_callback(bundle);
          }}
        >
          <img
            src={FLOWER_ICON_URI}
            className="rounded-full border
              hover:bg-amber-200
              bg-amber-600
              border-transparent
            "
          />
        </button>
        <button
          onClick={async (e) => {
            e.preventDefault();
            add_callback(bundle);
          }}
        >
          <img
            src={PLUS_ICON_URI}
            className="rounded-sm border 
                bg-emerald-400
                border-transparent
                hover:shadow-xl
                hover:shadow-black
                "
          />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            search_callback(bundle);
          }}
        >
          <img
            src={SEARCH_ICON_URI}
            className="rounded-sm border 
                bg-transparent
                border-transparent
                hover:shadow-xl
                hover:shadow-black"
          />
        </button>
        <button
          onClick={async (e) => {
            e.preventDefault();
            del_callback(bundle);
          }}
        >
          <img
            src={X_ICON_URI}
            className="rounded-full 
            bg-red-500 hover:bg-red-700"
          />
        </button>
      </div>
    </div>
  );
};
