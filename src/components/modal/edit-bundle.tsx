import { Dispatch, SetStateAction } from "react";
import Modal from "./generic";
import { IBundleConfig } from "@/types";

export const EditBundleModal = ({
  isOpenModal,
  setIsOpenModal,
  title,
  bundleConfig,
  setBundleConfig,
  submit_callback,
}: {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  title: string;
  bundleConfig: IBundleConfig;
  setBundleConfig: Dispatch<SetStateAction<IBundleConfig>>;
  submit_callback: (bc: IBundleConfig) => void;
}) => {
  return (
    <Modal
      {...{
        title,
        isOpenModal,
        setIsOpenModal,
      }}
    >
      <div
        className="flex flex-col space-y-2
                  px-2 sm:px-5
                  py-2 pb-5"
      >
        <div className="flex flex-col space-y-1">
          <label className="font-bold text-white">Name</label>
          <input
            type="text"
            value={bundleConfig.name}
            className="bg-slate-300 text-black w-full
                          rounded-md p-2"
            onChange={(e) => {
              e.preventDefault();
              setBundleConfig({
                ...bundleConfig,
                name: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="font-bold text-white">Description</label>
          <textarea
            className="bg-slate-300 text-black w-full
                        rounded-md p-2 min-w-20"
            value={bundleConfig.description}
            onChange={(e) => {
              e.preventDefault();
              setBundleConfig({
                ...bundleConfig,
                description: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-emerald-300 hover:bg-emerald-500
                        rounded-lg
                        px-4 py-2
                        font-bold text-black"
            onClick={async (e) => {
              e.preventDefault();
              submit_callback(bundleConfig);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};
