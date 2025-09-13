import { RELOAD_ICON_URI } from "@/icons/bootstrap";

export const CandidateHeader = ({
  reload_callback,
}: {
  reload_callback: () => void;
}) => {
  return (
    <div
      className="flex flex-row justify-start space-x-2
        content-center align-middle items-center"
    >
      <h2 className="leading text-slate-300 font-bold">Candidates</h2>
      <button
        onClick={(e) => {
          e.preventDefault();
          reload_callback();
        }}
      >
        <img
          src={RELOAD_ICON_URI}
          className="rounded-full bg-purple-400 hover:bg-purple-600"
        />
      </button>
    </div>
  );
};
