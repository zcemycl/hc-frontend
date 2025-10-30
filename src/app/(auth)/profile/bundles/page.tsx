"use client";
import {
  BundleListItem,
  EditBundleModal,
  ListPageTemplate,
  PaginationBar2,
  ProfileBar,
  ProtectedRoute,
  Spinner,
  TypographyH2,
} from "@/components";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  createBundleByUserIdv2,
  deleteBundleByIdv2,
  fetchAnnotateSourcev2,
  fetchBundlesByUserIdv2,
  fetchBundlesCountByUserIdv2,
  fetchUserInfoByIdv2,
  patchBundleByIdv2,
} from "@/http/backend";
import {
  AnnotationCategoryEnum,
  IAnnotationRef,
  IAnnotationSourceMap,
  IBundle,
  IBundleConfig,
  IBundleUpdate,
  IUser,
  UserRoleEnum,
} from "@/types";
import { useApiHandler } from "@/hooks";
import { PLUS_ICON_URI } from "@/icons/bootstrap";
import { AnnotationTypeEnum, defaultBundleConfig } from "@/constants";
import { adjustPageNAfterDelete } from "@/http/utils";
import { useRouter } from "next/navigation";
import { confirm_bundle_purpose } from "@/utils";

export default function Page() {
  const router = useRouter();
  const { userId, isLoadingAuth, userData } = useAuth();
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
  const [annSource, setAnnSource] = useState<IAnnotationSourceMap>({});
  const { versions } = useContext(FdaVersionsContext);
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
                    versions,
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
              const bundle = b;
              const myRole2Bundle = bundle?.user_links?.find(
                (link) => link.user_id === userData.id,
              )?.role;
              const isHidden = myRole2Bundle !== UserRoleEnum.ADMIN;
              return (
                <BundleListItem
                  key={`${b.name}-group-btn`}
                  {...{
                    b,
                    annSource,
                    isExpand: showContents[idx],
                    expandInfoCallback: async () => {
                      setShowContents((prev: boolean[]) => {
                        let copy = [...prev];
                        copy[idx] = !copy[idx];
                        return copy;
                      });
                      const ann_ids = b.annotations
                        .map((v: IAnnotationRef) => v.id)
                        .filter(
                          (vid: number) =>
                            !Object.keys(annSource).includes(String(vid)),
                        );
                      if (ann_ids.length === 0) return;
                      const restmp = await withLoading(() =>
                        fetchAnnotateSourcev2(ann_ids, versions),
                      );
                      if (!restmp.success) handleResponse(restmp);
                      setAnnSource((prev: IAnnotationSourceMap) => {
                        return {
                          ...restmp.data,
                          ...prev,
                        };
                      });
                    },
                    editCallback: isHidden
                      ? undefined
                      : async () => {
                          setModalMode("edit");
                          setIsOpenModal(true);
                          setBundleConfig({
                            id: b.id,
                            name: b.name,
                            description: b.description,
                          });
                        },
                    delCallback: isHidden
                      ? undefined
                      : async () => {
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
                        },
                    fdaClickCallback: async (fid: string) => {
                      router.push(`/fdalabel?fdalabel_id=${fid}`);
                    },
                    annotationClickCallback: (
                      setid: string,
                      category: AnnotationCategoryEnum,
                      table_id: number | string,
                    ) => {
                      router.push(
                        `/annotate/fdalabel/${setid}/${category}/${table_id}?tab=${AnnotationTypeEnum.COMPLETE}`,
                      );
                    },
                  }}
                />
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
