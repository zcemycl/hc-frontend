"use client";
import {
  CompositeCorner,
  ListPageTemplate,
  Modal,
  ProfileBar,
  ProtectedRoute,
} from "@/components";
import { useAuth, useLoader } from "@/contexts";
import { useApiHandler } from "@/hooks";
import { fetchBundleByIdv2, patchBundleByIdv2 } from "@/http/backend";
import {
  IAnnotationRef,
  IBundle,
  IFdaLabelRef,
  IUserRef,
  UserRoleEnum,
} from "@/types";
import { Plus, SendHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const bundle_id = searchParams.get("id");
  const [bundle, setBundle] = useState<IBundle | null>(null);
  const { withLoading } = useLoader();
  const { handleResponse } = useApiHandler();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const { userData } = useAuth();

  const getData = useCallback(async () => {
    const resBundle = await withLoading(() =>
      fetchBundleByIdv2(bundle_id as string),
    );
    console.log(resBundle);
    if (!resBundle.success) handleResponse(resBundle);
    setBundle(resBundle.data || null);
  }, [bundle_id]);

  useEffect(() => {
    getData();
    console.log(userData);
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
              {bundle?.users.map((u: IUserRef) => {
                const myRole2Bundle = bundle?.user_links?.find(
                  (link) => link.user_id === userData.id,
                )?.role;
                const curEmailRole2Bundle = bundle?.user_links?.find(
                  (link) => link.user_id === u.id,
                )?.role;
                // curEmailRole = ADMIN -> false else true to prevent creator of bundle
                // cmyRole2Bundle = USER -> false else true to prevent user of bundle to delete
                let isHidden = false;
                isHidden = curEmailRole2Bundle === UserRoleEnum.ADMIN;
                if (myRole2Bundle === UserRoleEnum.USER) isHidden = true;
                return (
                  <div
                    className="px-2 bg-emerald-400
                        rounded-lg font-semibold text-black"
                    key={`bundle-user-${u.email}`}
                  >
                    <CompositeCorner
                      {...{
                        label: u.email,
                        click_callback: () => {},
                        del_callback: isHidden
                          ? undefined
                          : async () => {
                              const emailsAfterDel = bundle?.users
                                .filter((em) => em.email !== u.email)
                                .map((em) => em.email);
                              const patchBundleResult = await withLoading(() =>
                                patchBundleByIdv2(bundle?.id as string, {
                                  emails: emailsAfterDel,
                                }),
                              );
                              if (!patchBundleResult.success)
                                handleResponse(patchBundleResult);
                              await getData();
                            },
                      }}
                    />
                  </div>
                );
              })}
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
                <div
                  className="px-2 bg-emerald-400 
                        rounded-lg font-semibold text-black"
                  key={`bundle-drug-${f.setid}`}
                >
                  <CompositeCorner
                    {...{
                      label: f.tradename,
                      click_callback: () => {},
                      del_callback: async () => {
                        const fdaAfterDel = bundle.fdalabels
                          .filter((f_) => f_.id !== f.id)
                          .map((f_) => f_.tradename);
                        console.log(fdaAfterDel);
                        const patchBundleResult = await withLoading(() =>
                          patchBundleByIdv2(bundle.id, {
                            tradenames: fdaAfterDel,
                          }),
                        );
                        handleResponse(patchBundleResult);
                        if (!patchBundleResult.success) return;
                        await getData();
                      },
                    }}
                  />
                </div>
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
                <div
                  className="px-2 bg-emerald-400 
                        rounded-lg font-semibold text-black"
                  key={`bundle-annotation-${ann.id}`}
                >
                  <CompositeCorner
                    {...{
                      label: `${ann.category} - ${ann.table_id} - ${ann.id}`,
                      click_callback: () => {},
                      del_callback: async () => {
                        const bundlesAfterDel = bundle.annotations
                          .filter((ann_) => ann_.id !== ann.id)
                          .map((ann_) => ann_.id);
                        console.log(bundlesAfterDel);
                        const patchBundleResult = await withLoading(() =>
                          patchBundleByIdv2(bundle.id, {
                            annotation_ids: bundlesAfterDel,
                          }),
                        );
                        handleResponse(patchBundleResult);
                        if (!patchBundleResult.success) return;
                        await getData();
                      },
                    }}
                  />
                </div>
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
                    const eSet = new Set();
                    bundle?.users.forEach((em) => eSet.add(em.email));
                    eSet.add(email);
                    const patchBundleResult = await withLoading(() =>
                      patchBundleByIdv2(bundle?.id as string, {
                        emails: Array.from(eSet) as string[],
                      }),
                    );
                    if (!patchBundleResult.success)
                      handleResponse(patchBundleResult);
                    await getData();
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
