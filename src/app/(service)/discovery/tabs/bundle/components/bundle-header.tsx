import { PLUS_ICON_URI } from "@/icons/bootstrap";

export const BundleHeader = ({
  add_callback,
}: {
  add_callback: () => void;
}) => {
  return (
    <div className="w-full flex flex-row justify-start space-x-2 align-middle items-center">
      <h2 className="leading text-slate-300 font-bold">Bundles</h2>
      <button
        className="w-5 h-5 rounded-full"
        onClick={(e) => {
          e.preventDefault();
          add_callback();
        }}
      >
        <img
          className="w-5 h-5 
            bg-emerald-300 rounded-full
            hover:bg-emerald-500
            "
          src={PLUS_ICON_URI}
        />
      </button>
    </div>
  );
};
