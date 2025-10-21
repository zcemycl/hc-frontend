"use client";
import {
  EditBundleModal,
  ListPageTemplate,
  PaginationBar2,
  ProfileBar,
  ProtectedRoute,
  Spinner,
  TypographyH2,
} from "@/components";
import { useAuth, useLoader } from "@/contexts";
import { useCallback, useEffect, useState } from "react";
import {
  createBundleByUserIdv2,
  deleteBundleByIdv2,
  fetchBundlesByUserIdv2,
  fetchBundlesCountByUserIdv2,
  fetchUserInfoByIdv2,
  patchBundleByIdv2,
} from "@/http/backend";
import { IBundle, IBundleConfig, IBundleUpdate, IUser } from "@/types";
import { useApiHandler } from "@/hooks";
import {
  INFO_CIRCLE_ICON_URI,
  PEN_ICON_URI,
  PLUS_ICON_URI,
  X_ICON_URI,
} from "@/icons/bootstrap";
import { defaultBundleConfig } from "@/constants";
import { adjustPageNAfterDelete } from "@/http/utils";
import { useRouter } from "next/navigation";

export default function Page() {
  const { userId, isLoadingAuth } = useAuth();
  const router = useRouter();
  const { isLoadingv2, withLoading } = useLoader();
  const { handleResponse } = useApiHandler();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);
  const [bundles, setBundles] = useState<IBundle[]>([]);
  const [bundlesCount, setBundlesCount] = useState(0);
  const nPerPage = 10;
  const [pageN, setPageN] = useState(0);
  const [showContents, setShowContents] = useState<boolean[]>([false]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [bundleConfig, setBundleConfig] = useState<IBundleConfig>({
    ...defaultBundleConfig,
  });
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const fetchBundlesCallback = useCallback(async () => {
    const [tmpBundlesRes, tmpBundlesCount] = await withLoading(() =>
      Promise.all([
        fetchBundlesByUserIdv2(userId as number, nPerPage * pageN, nPerPage),
        fetchBundlesCountByUserIdv2(userId as number),
      ]),
    );
    handleResponse(tmpBundlesRes);
    setBundles(tmpBundlesRes.data ?? []);
    handleResponse(tmpBundlesCount);
    setBundlesCount(tmpBundlesCount.data ?? 0);
    console.log("bundles", tmpBundlesRes.data ?? [], tmpBundlesCount);
  }, [userId, pageN]);

  useEffect(() => {
    async function getProfile(id: number) {
      const userInfo = await fetchUserInfoByIdv2(id);
      handleResponse(userInfo);
      if (userInfo.success) setProfileInfo(userInfo.data ?? null);
      await fetchBundlesCallback();
    }
    if (isLoadingAuth) return;
    getProfile(userId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId, pageN]);

  useEffect(() => {
    setShowContents(bundles.map((_) => false));
  }, [bundles]);

  return (
    <ProtectedRoute>
      <ListPageTemplate>
        {isLoadingv2 ? (
          <Spinner />
        ) : (
          <ProfileBar
            {...{
              username: profileInfo?.username! as string,
              role: profileInfo?.role!,
            }}
          />
        )}
        <hr className="mb-2" />
        <div className="flex flex-row justify-between">
          <TypographyH2>Bundles X{bundlesCount}</TypographyH2>
          <div className="flex flex-row space-x-1 items-center">
            <button
              className="w-5 h-5 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                setModalMode("add");
                setBundleConfig({ ...defaultBundleConfig });
                setIsOpenModal((prev) => !prev);
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
        </div>
        <EditBundleModal
          {...{
            isOpenModal,
            setIsOpenModal,
            title: modalMode === "add" ? "Add Bundle" : "Edit Bundle",
            bundleConfig,
            setBundleConfig,
            submit_callback: async (bc: IBundleConfig) => {
              if (bc.name.trim() === "") {
                return;
              }
              if (modalMode === "add") {
                console.log("add");
                const createBundleRes = await withLoading(() =>
                  createBundleByUserIdv2(userId as number, bc),
                );
                handleResponse(createBundleRes);
                if (!createBundleRes.success) return;
              } else if (modalMode === "edit") {
                console.log("edit");
                const updateBundleRes = await withLoading(() =>
                  patchBundleByIdv2(
                    bundleConfig.id as string,
                    bundleConfig as IBundleUpdate,
                  ),
                );
                handleResponse(updateBundleRes);
                if (!updateBundleRes.success) return;
              }
              await fetchBundlesCallback();
              setBundleConfig({ ...defaultBundleConfig });
              setIsOpenModal(false);
            },
          }}
        />

        <div className="flex flex-col space-y-1">
          {bundles.length === 0 ? (
            <p className="leading-relaxed mb-1">No Record ...</p>
          ) : (
            bundles.map((b: IBundle, idx: number) => {
              let useFor: string = "Not In Use";
              if (b.annotations.length === 0 && b.fdalabels.length === 0) {
                useFor = "Not In Use";
              } else if (b.annotations.length === 0 && b.fdalabels.length > 0) {
                useFor = "Fdalabel";
              } else if (b.annotations.length > 0 && b.fdalabels.length === 0) {
                useFor = "Annotation";
              }
              console.log(b.fdalabels);
              return (
                <div
                  key={`${b.name}-group-btn`}
                  onClick={(e) => {
                    e.preventDefault();
                    const params = new URLSearchParams();
                    params.append("id", b.id);
                    router.push(`/bundle?${params}`);
                  }}
                  className="px-3 py-2 text-clip
                    flex rounded-lg border-emerald-200 border-2
                    text-white cursor-pointer
                    hover:bg-emerald-500 hover:text-black
                    justify-between flex-col
                  "
                >
                  <div
                    className="flex flex-row 
                    justify-between font-bold"
                  >
                    <div
                      className="flex flex-row justify-start
                      space-x-2 text-clip min-w-0 basis-2/3"
                    >
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-shrink min-w-0">
                        {b.name}
                      </span>
                      <span className="bg-amber-300 rounded-lg px-3 text-black flex-shrink-0 whitespace-nowrap">
                        {useFor}
                      </span>
                    </div>

                    <div
                      id="sub-buttons"
                      className="
                      flex flex-row space-x-2
                      items-center basis-1/3 justify-end"
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowContents((prev: boolean[]) => {
                            let copy = [...prev];
                            copy[idx] = !copy[idx];
                            return copy;
                          });
                        }}
                      >
                        <img
                          src={INFO_CIRCLE_ICON_URI}
                          className="rounded-full 
                          bg-sky-300 hover:bg-sky-700"
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setModalMode("edit");
                          setIsOpenModal(true);
                          setBundleConfig({
                            id: b.id,
                            name: b.name,
                            description: b.description,
                          });
                        }}
                      >
                        <img
                          src={PEN_ICON_URI}
                          className="
                          rounded-full bg-purple-400
                          hover:bg-purple-600"
                        />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const deleteBundleResult = await withLoading(() =>
                            deleteBundleByIdv2(b.id),
                          );
                          handleResponse(deleteBundleResult);
                          if (!deleteBundleResult.success) return;
                          setPageN((prevPageN: number) =>
                            adjustPageNAfterDelete({
                              prevPageN,
                              totalBundlesAfterDelete: bundlesCount - 1,
                              nPerPage,
                            }),
                          );
                          await fetchBundlesCallback();
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
                  <div
                    id="hide-ele"
                    className={`transition-all
                    origin-top overflow-hidden duration-150
                    flex flex-col space-y-1
                    ${showContents[idx] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <span>{b.description}</span>
                    <div className="flex flex-row gap-2 flex-wrap">
                      {b.fdalabels.map((subf) => (
                        <div
                          key={subf.tradename}
                          className="px-2 bg-emerald-400 rounded
                            text-black font-semibold"
                        >
                          {subf.tradename}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-row gap-2 flex-wrap">
                      {b.annotations.map((suba) => (
                        <div
                          key={`bann-${suba.id}`}
                          className="px-2 bg-emerald-400 rounded
                            text-black font-semibold"
                        >
                          {suba.category} - {suba.table_id} - {suba.id}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <PaginationBar2
          pageN={pageN}
          setPageN={setPageN}
          topN={bundlesCount}
          nPerPage={nPerPage}
        />
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
