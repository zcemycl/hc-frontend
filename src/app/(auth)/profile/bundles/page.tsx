"use client";
import {
  EditBundleModal,
  Modal,
  PaginationBar2,
  ProtectedRoute,
  TypographyH2,
} from "@/components";
import { useAuth, useLoader } from "@/contexts";
import ProfileBar from "../profile-bar";
import { useCallback, useEffect, useState } from "react";
import {
  createBundleByUserIdv2,
  fetchBundlesByUserIdv2,
  fetchBundlesCountByUserIdv2,
  fetchUserInfoByIdv2,
} from "@/http/backend";
import { IBundle, IBundleConfig, IUser } from "@/types";
import { useApiHandler } from "@/hooks";
import {
  INFO_CIRCLE_ICON_URI,
  PEN_ICON_URI,
  PLUS_ICON_URI,
  X_ICON_URI,
} from "@/icons/bootstrap";
import { defaultBundleConfig } from "@/constants";

export default function Page() {
  const { userId, isLoadingAuth } = useAuth();
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
      <section
        className={`text-gray-400 bg-gray-900 body-font 
              h-[81vh] sm:h-[89vh] overflow-y-scroll
              ${isLoadingv2 ? "animate-pulse" : ""}`}
      >
        <div
          className="mt-[10rem] flex flex-col
               content-center items-center
            "
        >
          <div className="w-11/12 sm:w-7/12 flex flex-col space-y-3">
            <ProfileBar
              {...{
                username: profileInfo?.username! as string,
                role: profileInfo?.role!,
              }}
            />
            <hr className="mb-2" />
            <div className="flex flex-row justify-between">
              <TypographyH2>Bundles X{bundlesCount}</TypographyH2>
              <div className="flex flex-row space-x-1 items-center">
                <button
                  className="w-5 h-5 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
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
                title: "Add Bundle",
                bundleConfig,
                setBundleConfig,
                submit_callback: async (bc: IBundleConfig) => {
                  if (bc.name.trim() === "") {
                    return;
                  }
                  const createBundleRes = await createBundleByUserIdv2(
                    userId as number,
                    bc,
                  );
                  handleResponse(createBundleRes);
                  if (!createBundleRes.success) return;
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
                  return (
                    <div
                      key={`${b.name}-group-btn`}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("abc");
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
                        <span>{b.name}</span>
                        <div
                          id="sub-buttons"
                          className="
                          flex flex-row space-x-2
                          items-center"
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("bbc");
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
                        ${showContents[idx] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        {b.description}
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
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
