"use client";
import { Table, ExpandableBtn } from "@/components";
import { ProtectedRoute, useAuth } from "@/contexts";
import { fetchAETableBySetid } from "@/http/backend";
import { GoIcon } from "@/icons";
import { IAdverseEffectTable, IBaseTable } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { credentials, isLoadingAuth } = useAuth();
  const [tableData, setTableData] = useState<IAdverseEffectTable[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    async function getData() {
      const res = await fetchAETableBySetid(params.id);
      setTableData(res);
    }
    if (isLoadingAuth) return;
    if (credentials.length === 0) return;
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
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
              Label {params.id} Adverse Effect Tables
            </p>
          </div>
          {tableData.map((data, idx) => {
            return (
              <ExpandableBtn
                key={`${params.id}-${idx}`}
                refkey={`${params.id}-${idx}`}
                hoverCondition={hoverIdx === idx}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    `/annotate/fdalabel/${params.id}/adverse_effect_table/${idx + 1}`,
                  );
                }}
                onMouseOver={(e) => {
                  setHoverIdx(idx);
                }}
                childrenLong={
                  <Table
                    {...{
                      content: {
                        table: data.content.table.slice(0, 6),
                      } as IBaseTable,
                    }}
                  />
                }
              >
                <>
                  <p className="leading-relaxed w-full">[Table {idx + 1}]</p>
                  <div
                    className={`transition duration-300
                    ${hoverIdx == idx ? "opacity-1 translate-x-0" : "opacity-0 -translate-x-1/2"}`}
                  >
                    <GoIcon />
                  </div>
                </>
              </ExpandableBtn>
            );
          })}
        </div>
      </section>
    </ProtectedRoute>
  );
}
