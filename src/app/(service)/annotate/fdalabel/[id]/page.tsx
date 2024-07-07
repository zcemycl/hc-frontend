"use client";
import { Table } from "@/components";
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
  const { credentials } = useAuth();
  const [tableData, setTableData] = useState<IAdverseEffectTable[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      const res = await fetchAETableBySetid(params.id, credJson.AccessToken);
      setTableData(res);
    }

    if (credentials.length === 0) return;
    getData(credentials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <div
                className="sm:w-1/2 flex flex-col
                    w-screen space-y-2 mb-2 h-auto overflow-hidden"
                key={`${params.id}-${idx}`}
              >
                <button
                  className={`
                    rounded text-white border-blue-400
                    border-2 hover:border-blue-800 h-auto
                    p-2
                    hover:bg-blue-800 transition`}
                  onMouseOver={(e) => {
                    setHoverIdx(idx);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(
                      `/annotate/fdalabel/${params.id}/adverse_effect_table/${idx + 1}`,
                    );
                  }}
                >
                  <div className="flex justify-between">
                    <p className="leading-relaxed w-full">[Table {idx + 1}]</p>
                    <div
                      className={`transition duration-300
                    ${hoverIdx == idx ? "opacity-1 translate-x-0" : "opacity-0 -translate-x-1/2"}`}
                    >
                      <GoIcon />
                    </div>
                  </div>

                  <p
                    className={`leading-relaxed transition origin-top
                    ${hoverIdx == idx ? "max-h-full scale-y-100" : "max-h-0 scale-y-0"}`}
                  >
                    <Table
                      {...{
                        content: {
                          table: data.content.table.slice(0, 6),
                        } as IBaseTable,
                      }}
                    />
                  </p>
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </ProtectedRoute>
  );
}
