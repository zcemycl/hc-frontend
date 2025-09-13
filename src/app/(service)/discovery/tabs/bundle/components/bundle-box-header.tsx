import { PLUS_ICON_URI, SEARCH_ICON_URI, X_ICON_URI } from "@/icons/bootstrap";
import { IBundle } from "@/types";

export const BundleBoxHeader = ({
  bundle,
  add_callback,
  search_callback,
  del_callback,
}: {
  bundle: IBundle;
  add_callback: (bundle: IBundle) => void;
  search_callback: (bundle: IBundle) => void;
  del_callback: (bundle: IBundle) => void;
}) => {
  return (
    <div id="bundle-summary" className="flex flex-row justify-between">
      <div className="flex justfiy-start space-x-2">
        <span>{bundle.name}</span>
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
      </div>
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
  );
};
