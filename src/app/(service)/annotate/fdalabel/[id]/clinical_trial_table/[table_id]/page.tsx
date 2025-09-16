"use client";
import { Table, ProtectedRoute, BackBtn, PulseTemplate } from "@/components";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { useAuth, useLoader } from "@/contexts";
import { useApiHandler } from "@/hooks";
import { fetchAETableByIdsv2 } from "@/http/backend";
import {
  AnnotationCategoryEnum,
  IBaseTable,
  IClinicalTrialTable,
  IFdaVersions,
} from "@/types";
import { useEffect, useState } from "react";

interface PageProps {
  params: {
    id: string;
    table_id: number;
  };
}

export default function Page({ params }: PageProps) {
  const { handleResponse } = useApiHandler();
  const { credentials, isLoadingAuth, isAuthenticated } = useAuth();
  const { withLoading } = useLoader();
  const [tableData, setTableData] = useState<IClinicalTrialTable | null>(null);

  useEffect(() => {
    async function getData() {
      const res = await withLoading(() =>
        fetchAETableByIdsv2(
          params.table_id,
          AnnotationCategoryEnum.CLINICAL_TRIAL_TABLE,
          params.id,
          DEFAULT_FDALABEL_VERSIONS as IFdaVersions,
        ),
      );
      handleResponse(res);
      if (res.success) setTableData(res.data);
    }
    if (!isAuthenticated) return;
    if (credentials.length === 0) return;
    getData();
  }, [isLoadingAuth]);

  return (
    <ProtectedRoute>
      <PulseTemplate>
        <div className="overflow-x-hidden">
          <div className="flex flex-col justify-center content-center items-center mt-[7rem]">
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
        </div>
      </PulseTemplate>
    </ProtectedRoute>
  );
}
