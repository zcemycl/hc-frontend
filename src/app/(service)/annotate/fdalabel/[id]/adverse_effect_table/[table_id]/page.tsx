"use client";
import { ProtectedRoute, useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchAETableByIds } from "@/http/backend";
import { IAdverseEffectTable, IBaseTable } from "@/types";
import { Table, setup_selectable_cell_map } from "@/components";

interface PageProps {
  params: {
    id: string;
    table_id: number;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { credentials } = useAuth();
  const [tableData, setTableData] = useState<IAdverseEffectTable | null>(null);
  const n_rows = tableData?.content.table.length ?? 0;
  const n_cols = tableData?.content.table[0].length ?? 0;
  const cell_map = setup_selectable_cell_map(n_rows, n_cols);
  const [isCellSelected, setIsCellSelected] = useState<boolean[][]>(
    Array.from({ length: n_rows }, () =>
      Array.from({ length: n_cols }, () => false),
    ),
  );

  // set table
  useEffect(() => {
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      const res = await fetchAETableByIds(
        params.table_id,
        params.id,
        credJson.AccessToken,
      );
      console.log(res);
      setTableData(res);
    }
    if (credentials.length === 0) return;
    getData(credentials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set selected table dimension when table is ready
  useEffect(() => {
    let newSelected = Array.from({ length: n_rows }, () =>
      Array.from({ length: n_cols }, () => false),
    );
    setIsCellSelected(newSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  useEffect(() => {
    console.log(isCellSelected);
  }, [isCellSelected]);

  return (
    <ProtectedRoute>
      <section
        className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]
        overflow-y-scroll overflow-x-scroll"
      >
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
        "
        >
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
            <div className="flex justify-between">
              <h2 className="text-white text-lg mb-1 font-medium title-font">
                Annotation
              </h2>
              <button
                onClick={() => router.back()}
                className="bg-purple-700 rounded p-2 
                text-white hover:bg-purple-800"
              >
                Back
              </button>
            </div>

            <p className="leading-relaxed w-full">
              A.E Table {params.table_id} from label {params.id}
            </p>
            <div className="overflow-x-scroll flex flex-col w-full">
              {tableData && (
                <Table
                  {...{
                    content: {
                      table: tableData.content.table,
                    } as IBaseTable,
                    isSelectable: {
                      table: cell_map,
                    },
                    isSelected: {
                      table: isCellSelected,
                    },
                    setIsCellSelected,
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
