"use client";
import {
  ListPageTemplate,
  Modal,
  ProfileBar,
  ProtectedRoute,
} from "@/components";
import { useLoader } from "@/contexts";
import { useApiHandler } from "@/hooks";
import { fetchBundleByIdv2 } from "@/http/backend";
import { IAnnotationRef, IBundle, IFdaLabelRef, IUserRef } from "@/types";
import { Plus, SendHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const bundle_id = searchParams.get("id");
  const [bundle, setBundle] = useState<IBundle | null>(null);
  const { withLoading } = useLoader();
  const { handleResponse } = useApiHandler();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getData = async () => {
      const resBundle = await withLoading(() =>
        fetchBundleByIdv2(bundle_id as string),
      );
      console.log(resBundle);
      if (!resBundle.success) handleResponse(resBundle);
      setBundle(resBundle.data || null);
    };
    getData();
  }, [bundle_id]);

  const useFor = useMemo<string>(() => {
    if (bundle === null) return "Not In Use";
    let useFor: string = "Not In Use";
    if (bundle.annotations.length === 0 && bundle.fdalabels.length === 0) {
      useFor = "Not In Use";
    } else if (bundle.annotations.length === 0 && bundle.fdalabels.length > 0) {
      useFor = "Fdalabel";
    } else if (bundle.annotations.length > 0 && bundle.fdalabels.length === 0) {
      useFor = "Annotation";
    }
    return useFor;
  }, [bundle]);

  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <ProfileBar title={`Bundle ${bundle?.name || ""}`} />
        <hr className="mb-2" />
        <div id="basic-bundle-content" className="flex flex-col space-y-2">
          <div
            className="flex flex-row justify-start space-x-2
            select-text"
          >
            <span>Reference: </span>
            <span
              className="bg-amber-300 rounded-lg px-3 
            text-black flex-shrink-0 whitespace-nowrap
            font-semibold"
            >
              {bundle?.id}
            </span>
          </div>
          <div className="flex flex-row justify-start space-x-2">
            <span>Category: </span>
            <span
              className="bg-amber-300 rounded-lg px-3 
            text-black flex-shrink-0 whitespace-nowrap
            font-semibold"
            >
              {useFor}
            </span>
          </div>
          {bundle?.description !== "" && (
            <div className="flex flex-row justify-start space-x-2">
              Description: {bundle?.description}
            </div>
          )}
          {bundle?.users.length !== 0 && (
            <div
              className="flex flex-row justify-start space-x-2
                flex-wrap items-center"
            >
              <span>Owners: </span>
              {bundle?.users.map((u: IUserRef) => (
                <span
                  className="px-2 bg-emerald-400 
                        rounded-lg font-semibold text-black"
                  key={`bundle-user-${u.email}`}
                >
                  {u.email}
                </span>
              ))}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenModal(true);
                }}
              >
                <Plus
                  className="
                  rounded-lg bg-sky-400
                  hover:bg-sky-700
                  text-black
                "
                />
              </button>
            </div>
          )}
          {bundle?.fdalabels.length !== 0 && (
            <div
              className="flex flex-row justify-start gap-2
                flex-wrap"
            >
              <span>Drugs: </span>
              {bundle?.fdalabels.map((f: IFdaLabelRef) => (
                <span
                  className="px-2 bg-emerald-400 
                        rounded-lg font-semibold text-black"
                  key={`bundle-drug-${f.setid}`}
                >
                  {f.tradename}
                </span>
              ))}
            </div>
          )}
          {bundle?.annotations.length !== 0 && (
            <div
              className="flex flex-row justify-start gap-2
                flex-wrap"
            >
              <span>Annotations: </span>
              {bundle?.annotations.map((ann: IAnnotationRef) => (
                <span
                  className="px-2 bg-emerald-400 
                        rounded-lg font-semibold text-black"
                  key={`bundle-annotation-${ann.id}`}
                >
                  {ann.category} - {ann.table_id} - {ann.id}
                </span>
              ))}
            </div>
          )}
        </div>
        <Modal
          {...{
            title: "Add user by email",
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
              <label className="font-bold text-white">Email Address</label>
              <input
                type="text"
                value={email}
                className="bg-slate-300 text-black w-full
                          rounded-md p-2"
                onChange={(e) => {
                  e.preventDefault();
                  setEmail(e.target.value);
                }}
              />
              <div className="flex flex-row justify-end">
                <button
                  className="bg-emerald-300 hover:bg-emerald-500
                          rounded-lg flex flex-row justify-between
                          px-4 py-2 space-x-2
                          font-bold text-black"
                  onClick={async (e) => {
                    e.preventDefault();
                    setEmail("");
                    setIsOpenModal(false);
                  }}
                >
                  <SendHorizontal />
                  <span>Submit</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
