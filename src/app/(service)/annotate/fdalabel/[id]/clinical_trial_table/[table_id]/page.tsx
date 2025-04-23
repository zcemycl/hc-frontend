"use client";
import { Spinner, Table, ProtectedRoute, BackBtn } from "@/components";
import { useAuth, useLoader } from "@/contexts";
import { fetchAETableByIds } from "@/http/backend";
import {
  AnnotationCategoryEnum,
  IBaseTable,
  IClinicalTrialTable,
} from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: {
    id: string;
    table_id: number;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { credentials, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const [tableData, setTableData] = useState<IClinicalTrialTable | null>(null);

  useEffect(() => {
    async function getData() {
      const res = await fetchAETableByIds(
        params.table_id,
        AnnotationCategoryEnum.CLINICAL_TRIAL_TABLE,
        params.id,
      );
      setTableData(res);
    }
    if (isLoadingAuth) return;
    if (credentials.length === 0) return;
    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, [isLoadingAuth]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font h-[81vh] sm:h-[89vh]
        overflow-y-scroll overflow-x-hidden ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
      >
        <div className="flex flex-col justify-center content-center items-center mt-[7rem]">
          {(isLoading || isLoadingAuth) && (
            <div
              className="absolute left-1/2 top-1/2 
              -translate-x-1/2 -translate-y-1/2"
            >
              <Spinner />
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <div
            className="flex flex-col mt-8 
            sm:w-2/3 w-screen
            p-10 space-y-2"
          >
            <div className="flex justify-between">
              <h2 className="text-white text-lg mb-1 font-medium title-font">
                CT Table Annotation
              </h2>
              <BackBtn />
            </div>
            <p className="leading-relaxed w-full">
              C.T Table {params.table_id} from label {params.id}
            </p>

            <div
              className="overflow-x-auto 
              flex flex-col w-full"
            >
              {tableData && (
                <Table
                  {...{
                    content: {
                      table: tableData.content.table,
                    } as IBaseTable,
                    keyname: "table",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
