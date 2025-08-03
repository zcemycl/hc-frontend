"use client";
import {
  PaginationBar,
  ProtectedRoute,
  TypographyH2,
  VerToolbar,
} from "@/components";
import { FdaVersionsContext, useAuth, useLoader } from "@/contexts";
import {
  fetchUnannotatedAETableByUserId,
  fetchUnannotatedAETableByUserIdCount,
  fetchUserInfoById,
} from "@/http/backend";
import { AnnotationCategoryEnum, IUnAnnotatedAETable, IUser } from "@/types";
import { convert_datetime_to_simple } from "@/utils";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import ProfileBar from "../profile-bar";
import { AnnotationTypeEnum } from "@/constants";

export default function Page() {
  const { userId, credentials, setIsAuthenticated, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);
  const [tableData, setTableData] = useState<IUnAnnotatedAETable[]>([]);
  const [countAnnotated, setCountAnnotated] = useState(0);
  const [nPerPage, _] = useState(10);
  const [pageNAnnotate, setPageNAnnotate] = useState(0);
  const { versions, setVersions } = useContext(FdaVersionsContext);

  const setAnnotationRecord = useCallback(async (id: number, pageN: number) => {
    const annotatedData = await fetchUnannotatedAETableByUserId(
      id,
      AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
      nPerPage * pageNAnnotate,
      nPerPage,
      true,
      false,
      versions,
    );
    if (annotatedData !== undefined) setTableData(annotatedData);
  }, []);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!userId) return;
    setAnnotationRecord(userId as number, pageNAnnotate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId, pageNAnnotate]);

  useEffect(() => {
    async function getProfile(id: number) {
      const userInfo = await fetchUserInfoById(id);
      setProfileInfo({ ...profileInfo, ...userInfo });
      const numberAnnotated = await fetchUnannotatedAETableByUserIdCount(
        id,
        AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
        true,
        false,
        versions,
      );
      setCountAnnotated(numberAnnotated);
    }
    if (isLoadingAuth) return;

    if (credentials.length === 0) {
      setIsAuthenticated(false);
      router.push(
        process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/logout" : "/",
      );
    }
    if (!userId) return;
    getProfile(userId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, userId]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
          h-[81vh] sm:h-[89vh] overflow-y-scroll
          ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
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
            <TypographyH2>Annotation X{countAnnotated}</TypographyH2>
            <VerToolbar
              fdaSections={["fdalabel", "adverse_effect_table"]}
              reloadCallback={async () => {
                if (isLoadingAuth) return;
                if (!userId) return;
                const annotatedData = await fetchUnannotatedAETableByUserId(
                  userId,
                  AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
                  nPerPage * pageNAnnotate,
                  nPerPage,
                  true,
                  false,
                  versions,
                );
                if (annotatedData !== undefined) setTableData(annotatedData);
                const numberAnnotated =
                  await fetchUnannotatedAETableByUserIdCount(
                    userId,
                    AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
                    true,
                    false,
                    versions,
                  );
                setCountAnnotated(numberAnnotated);
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
            {countAnnotated / nPerPage > 1 && (
              <div className="flex justify-center space-x-1 flex-wrap">
                <PaginationBar
                  topN={countAnnotated}
                  pageN={pageNAnnotate}
                  nPerPage={nPerPage}
                  setPageN={(i: number) => {
                    setPageNAnnotate(i);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
