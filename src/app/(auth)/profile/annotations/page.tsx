"use client";
import {
  PaginationBar2,
  ProtectedRoute,
  PulseTemplate,
  TypographyH2,
  VerToolbar,
} from "@/components";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import {
  fetchUnannotatedAETableByUserIdv2,
  fetchUnannotatedAETableByUserIdCountv2,
  fetchUserInfoByIdv2,
} from "@/http/backend";
import { AnnotationCategoryEnum, IUnAnnotatedAETable, IUser } from "@/types";
import { convert_datetime_to_simple } from "@/utils";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import ProfileBar from "../profile-bar";
import { AnnotationTypeEnum } from "@/constants";
import { useApiHandler } from "@/hooks";

export default function Page() {
  const { userId, isLoadingAuth } = useAuth();
  const { handleResponse } = useApiHandler();
  const { withLoading } = useLoader();
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);
  const [tableData, setTableData] = useState<IUnAnnotatedAETable[]>([]);
  const [countAnnotated, setCountAnnotated] = useState(0);
  const [nPerPage, _] = useState(10);
  const [pageNAnnotate, setPageNAnnotate] = useState(0);
  const { versions } = useContext(FdaVersionsContext);

  const setAnnotationRecord = useCallback(async (id: number, pageN: number) => {
    const annotatedData = await withLoading(() =>
      fetchUnannotatedAETableByUserIdv2(
        id,
        AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
        nPerPage * pageN,
        nPerPage,
        true,
        false,
        versions,
        true,
      ),
    );
    handleResponse(annotatedData);
    if (annotatedData.success) setTableData(annotatedData.data ?? []);
  }, []);

  useEffect(() => {
    setAnnotationRecord(userId as number, pageNAnnotate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNAnnotate]);

  useEffect(() => {
    async function getProfile(id: number) {
      const userInfo = await withLoading(() => fetchUserInfoByIdv2(id));
      handleResponse(userInfo);
      if (userInfo.success) setProfileInfo(userInfo.data ?? null);
      const numberAnnotated = await withLoading(() =>
        fetchUnannotatedAETableByUserIdCountv2(
          id,
          AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
          true,
          false,
          versions,
        ),
      );
      handleResponse(numberAnnotated);
      if (numberAnnotated.success) setCountAnnotated(numberAnnotated.data ?? 0);
    }
    if (isLoadingAuth) return;
    if (!userId) return;
    getProfile(userId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId]);

  return (
    <ProtectedRoute>
      <PulseTemplate>
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
            <TypographyH2>Annotation X{countAnnotated}</TypographyH2>
            <VerToolbar
              fdaSections={["fdalabel", "adverse_effect_table"]}
              reloadCallback={async () => {
                if (isLoadingAuth) return;
                if (!userId) return;
                const annotatedData = await withLoading(() =>
                  fetchUnannotatedAETableByUserIdv2(
                    userId,
                    AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
                    nPerPage * pageNAnnotate,
                    nPerPage,
                    true,
                    false,
                    versions,
                  ),
                );
                handleResponse(annotatedData);
                if (annotatedData.success)
                  setTableData(annotatedData.data ?? []);
                const numberAnnotated = await withLoading(() =>
                  fetchUnannotatedAETableByUserIdCountv2(
                    userId,
                    AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
                    true,
                    false,
                    versions,
                  ),
                );
                handleResponse(numberAnnotated);
                if (numberAnnotated.success)
                  setCountAnnotated(numberAnnotated.data ?? 0);
              }}
            />
            <div className="flex flex-col space-y-1">
              {tableData.length === 0 ? (
                <p className="leading-relaxed mb-1">No Record ...</p>
              ) : (
                tableData.map((x, idx) => {
                  return (
                    <button
                      key={`history-annotation-${idx}`}
                      className="hover:bg-green-200 
                        text-clip overflow-clip
                        focus:bg-blue-200 transition
                        justify-start content-start
                        rounded px-2 hover:text-black"
                      onClick={(e) => {
                        e.preventDefault();
                        const params = new URLSearchParams();
                        params.append("tab", AnnotationTypeEnum.COMPLETE);
                        let redirectUrl = `/annotate/fdalabel/${x.fdalabel.setid}/adverse_effect_table/${x.idx}`;
                        redirectUrl = `${redirectUrl}?${params}`;
                        router.push(redirectUrl);
                      }}
                    >
                      <div className="flex justify-between">
                        <p className="leading-relaxed">
                          {convert_datetime_to_simple(x.created_date as string)}
                        </p>
                        <p className="leading-relaxed">
                          {x.fdalabel.tradename}
                        </p>
                        <p className="leading-relaxed">Table {x.idx}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            <div className="flex justify-center space-x-1 flex-wrap">
              <PaginationBar2
                topN={countAnnotated}
                pageN={pageNAnnotate}
                nPerPage={nPerPage}
                setPageN={(i: number) => {
                  setPageNAnnotate(i);
                }}
              />
            </div>
          </div>
        </div>
      </PulseTemplate>
    </ProtectedRoute>
  );
}
