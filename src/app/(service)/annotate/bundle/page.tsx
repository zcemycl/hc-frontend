"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { PageProps } from "./props";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  BundleListItem,
  ListPageTemplate,
  Modal,
  PaginationBar2,
  ProfileBar,
  ProtectedRoute,
  TypographyH2,
} from "@/components";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import {
  deleteBundleByIdv2,
  fetchAnnotateSourcev2,
  fetchBundlesByUserIdv2,
  fetchBundlesCountByUserIdv2,
  patchBundleByIdv2,
} from "@/http/backend";
import { AnnotationTypeEnum, BundleConnectEnum } from "@/constants";
import {
  AnnotationCategoryEnum,
  IAnnotationRef,
  IAnnotationSourceMap,
  IBundle,
  UserRoleEnum,
} from "@/types";
import { useApiHandler } from "@/hooks";
import { adjustPageNAfterDelete } from "@/http/utils";

export default function Page({ params }: Readonly<PageProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const annotation_id = searchParams.get("annotation_id");
  const { isLoadingv2, withLoading, isLoadingAuth } = useLoader();
  const { handleResponse } = useApiHandler();
  const { userId, userData } = useAuth();
  const nPerPage = 10;
  const [pageN, setPageN] = useState(0);
  const [bundles, setBundles] = useState<IBundle[]>([]);
  const [bundlesCount, setBundlesCount] = useState(0);
  const [targetBundleName, setTargetBundleName] = useState("");
  const [showContents, setShowContents] = useState<boolean[]>([false]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { versions } = useContext(FdaVersionsContext);
  const [annSource, setAnnSource] = useState<IAnnotationSourceMap>({});

  const fetchBundlesCallback = useCallback(async () => {
    const [tmpBundlesRes, tmpBundlesCount] = await withLoading(() =>
      Promise.all([
        fetchBundlesByUserIdv2(
          userId as number,
          nPerPage * pageN,
          nPerPage,
          BundleConnectEnum.ANNOTATION,
        ),
        fetchBundlesCountByUserIdv2(
          userId as number,
          BundleConnectEnum.ANNOTATION,
        ),
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
    console.log(searchParams);
    if (isLoadingAuth) return;
    fetchBundlesCallback();
  }, [isLoadingAuth, userId, pageN]);

  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <ProfileBar title={"Add Annotation to Bundle"} />
        <hr className="mb-2" />
        <div className="flex flex-row justify-between">
          <TypographyH2>Bundles X{bundlesCount}</TypographyH2>
          <button
            className="px-2 bg-emerald-500 
            hover:bg-emerald-300
            rounded-lg text-black font-semibold"
            onClick={(e) => {
              e.preventDefault();
              window.history.go(-2);
            }}
          >
            Back to Annotations List Page
          </button>
        </div>
        <Modal
          {...{
            title: `Add to this bundle -- ${targetBundleName}? `,
            isOpenModal,
            setIsOpenModal,
          }}
        >
          <></>
        </Modal>
        <div className="flex flex-col space-y-1">
          {bundles.length === 0 ? (
            <p className="leading-relaxed mb-1">No Record ...</p>
          ) : (
            bundles.map((b: IBundle, idx: number) => {
              const bundle = b;
              let useFor: string = "Not In Use";
              if (b.annotations.length === 0 && b.fdalabels.length === 0) {
                useFor = "Not In Use";
              } else if (b.annotations.length === 0 && b.fdalabels.length > 0) {
                useFor = "Fdalabel";
              } else if (b.annotations.length > 0 && b.fdalabels.length === 0) {
                useFor = "Annotation";
              }
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
                      const aSet = new Set();
                      b.annotations.forEach((ann) => aSet.add(ann.id));
                      aSet.add(annotation_id);
                      console.log(aSet);
                      const aArr = Array.from(aSet) as number[];
                      const patchBundleResult = await withLoading(() =>
                        patchBundleByIdv2(b.id, {
                          annotation_ids: aArr as number[],
                        }),
                      );
                      await fetchAnnSrcFromIdsCallback(
                        aArr.filter((vid: number) => !(vid in annSource)),
                      );
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
