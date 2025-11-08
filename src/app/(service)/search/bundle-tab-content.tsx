"use client";
import {
  BundleListItem,
  EditBundleModal,
  PaginationBar2,
  ProfileBar,
  TypographyH2,
} from "@/components";
import {
  AnnotationTypeEnum,
  BundleConnectEnum,
  defaultBundleConfig,
} from "@/constants";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import { useApiHandler } from "@/hooks";
import {
  createBundleByUserIdv2,
  deleteBundleByIdv2,
  fetchAnnotateSourcev2,
  fetchBundlesByUserIdv2,
  fetchBundlesCountByUserIdv2,
  patchBundleByIdv2,
} from "@/http/backend";
import { adjustPageNAfterDelete } from "@/http/utils";
import {
  AnnotationCategoryEnum,
  IAnnotationRef,
  IAnnotationSourceMap,
  IBundle,
  IBundleConfig,
  UserRoleEnum,
} from "@/types";
import { ArrowBigLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

const BundleTabContent = ({
  annotation_id,
  tradenames,
  mode = null,
}: {
  mode: BundleConnectEnum | null;
  annotation_id?: string | number;
  tradenames?: string[];
}) => {
  const router = useRouter();
  const { isLoadingv2, withLoading, isLoadingAuth } = useLoader();
  const { handleResponse } = useApiHandler();
  const { userId, userData } = useAuth();
  const nPerPage = 10;
  const [pageN, setPageN] = useState(0);
  const [bundles, setBundles] = useState<IBundle[]>([]);
  const [bundlesCount, setBundlesCount] = useState(0);
  const [showContents, setShowContents] = useState<boolean[]>([false]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { versions } = useContext(FdaVersionsContext);
  const [annSource, setAnnSource] = useState<IAnnotationSourceMap>({});
  const [bundleConfig, setBundleConfig] = useState<IBundleConfig>({
    ...defaultBundleConfig,
  });

  const fetchBundlesCallback = useCallback(async () => {
    const [tmpBundlesRes, tmpBundlesCount] = await withLoading(() =>
      Promise.all([
        fetchBundlesByUserIdv2(
          userId as number,
          nPerPage * pageN,
          nPerPage,
          mode,
        ),
        fetchBundlesCountByUserIdv2(userId as number, mode),
      ]),
    );
    console.log(tmpBundlesCount, tmpBundlesRes);
    if (!tmpBundlesRes.success) handleResponse(tmpBundlesRes);
    setBundles(tmpBundlesRes.data ?? []);
    if (!tmpBundlesCount) handleResponse(tmpBundlesCount);
    setBundlesCount(tmpBundlesCount.data ?? 0);
    console.log("bundles", tmpBundlesRes.data ?? [], tmpBundlesCount);
  }, [userId, pageN]);

  const fetchAnnSrcFromIdsCallback = useCallback(
    async (ann_ids: number[]) => {
      if (ann_ids.length === 0) return;
      const restmp = await withLoading(() =>
        fetchAnnotateSourcev2(ann_ids, versions),
      );
      console.log(restmp);
      if (!restmp.success) handleResponse(restmp);
      setAnnSource((prev: IAnnotationSourceMap) => {
        return {
          ...restmp.data,
          ...prev,
        };
      });
    },
    [versions],
  );

  useEffect(() => {
    if (isLoadingAuth) return;
    fetchBundlesCallback();
  }, [isLoadingAuth, userId, pageN]);

  return (
    <>
      <ProfileBar title={`Add ${mode} to Bundle`} />
      <hr className="mb-2" />
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start gap-2 items-center">
          <TypographyH2>Bundles X{bundlesCount}</TypographyH2>
          <button
            className="leading-[0px] m-0
              text-black"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpenModal((prev) => !prev);
            }}
          >
            <Plus
              className="rounded-lg
                hover:bg-green-500 bg-green-300
                text-black
                hover:text-white"
            />
          </button>
        </div>

        {mode === BundleConnectEnum.ANNOTATION && (
          <button
            className="px-2 bg-emerald-500 
            hover:bg-emerald-300
            rounded-lg text-black font-semibold
            flex flex-row gap-2 flex-wrap items-center
            text-center"
            onClick={(e) => {
              e.preventDefault();
              window.history.go(-2);
            }}
          >
            <span className="text-center">Back to Annotations List Page</span>
            <ArrowBigLeft className="w-4 h-4" />
          </button>
        )}
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
            const createBundleRes = await withLoading(() =>
              createBundleByUserIdv2(userId as number, bc),
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
                    await fetchAnnSrcFromIdsCallback(ann_ids);
                  },
                  addCallback: async () => {
                    let patchBundleResult;
                    if (mode === null) return;
                    if (mode === BundleConnectEnum.ANNOTATION) {
                      const aSet = new Set();
                      b.annotations.forEach((ann) => aSet.add(ann.id));
                      aSet.add(annotation_id);
                      const aArr = Array.from(aSet) as number[];
                      patchBundleResult = await withLoading(() =>
                        patchBundleByIdv2(
                          b.id,
                          {
                            annotation_ids: aArr as number[],
                          },
                          versions,
                        ),
                      );
                      await fetchAnnSrcFromIdsCallback(
                        aArr.filter((vid: number) => !(vid in annSource)),
                      );
                    } else if (mode === BundleConnectEnum.FDALABEL) {
                      const tSet = new Set();
                      b.fdalabels.forEach((f) => tSet.add(f.tradename));
                      if (tradenames?.length === 0) return;
                      tradenames?.forEach((t) => tSet.add(t));
                      console.log(tradenames);
                      const tArr = Array.from(tSet) as string[];
                      patchBundleResult = await withLoading(() =>
                        patchBundleByIdv2(
                          b.id,
                          {
                            tradenames: tArr as string[],
                          },
                          versions,
                        ),
                      );
                    }
                    handleResponse(patchBundleResult);
                    if (!patchBundleResult.success) return;
                    await fetchBundlesCallback();
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
                  fdaClickCallback: (setid: string) => {
                    router.push(`/fdalabel?fdalabel_id=${setid}`);
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
    </>
  );
};

export { BundleTabContent };
