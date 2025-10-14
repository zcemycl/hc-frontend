"use client";
import { useSearchParams } from "next/navigation";
import { PageProps } from "./props";
import { useCallback, useEffect, useState } from "react";
import {
  ListPageTemplate,
  PaginationBar2,
  ProfileBar,
  ProtectedRoute,
  TypographyH2,
} from "@/components";
import { useAuth, useLoader } from "@/contexts";
import {
  deleteBundleByIdv2,
  fetchBundlesByUserIdv2,
  fetchBundlesCountByUserIdv2,
} from "@/http/backend";
import { BundleConnectEnum } from "@/constants";
import { IBundle } from "@/types";
import { useApiHandler } from "@/hooks";
import { adjustPageNAfterDelete } from "@/http/utils";
import { INFO_CIRCLE_ICON_URI, X_ICON_URI } from "@/icons/bootstrap";

export default function Page({ params }: Readonly<PageProps>) {
  const searchParams = useSearchParams();
  const { isLoadingv2, withLoading, isLoadingAuth } = useLoader();
  const { handleResponse } = useApiHandler();
  const { userId } = useAuth();
  const nPerPage = 10;
  const [pageN, setPageN] = useState(0);
  const [bundles, setBundles] = useState<IBundle[]>([]);
  const [bundlesCount, setBundlesCount] = useState(0);
  const [showContents, setShowContents] = useState<boolean[]>([false]);

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
        </div>
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
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
