"use client";
import { PaginationBar, TypographyH2, Table } from "@/components";
import { fetchUnannotatedAETableByUserId } from "@/http/backend";
import { ProtectedRoute, useAuth } from "@/contexts";
import { IBaseTable, IUnAnnotatedAETable } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoIcon } from "@/icons";

export default function Page() {
  const router = useRouter();
  const { userId, credentials } = useAuth();
  const [tableData, setTableData] = useState<IUnAnnotatedAETable[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [pageN, setPageN] = useState(0);
  const [nPerPage, _] = useState(10);

  useEffect(() => {
    async function getData(credentials: string, userId: number) {
      const credJson = JSON.parse(credentials);
      const res = await fetchUnannotatedAETableByUserId(
        userId,
        credJson.AccessToken,
        pageN * nPerPage,
        nPerPage,
      );
      setTableData(res);
      console.log(res);
    }
    if (credentials.length === 0) return;
    getData(credentials, userId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageN]);

  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh] overflow-y-scroll">
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-10 pt-10 pb-5 space-y-2">
            <div className="flex justify-between">
              <TypographyH2>Unannotated Tables</TypographyH2>
            </div>
          </div>
          {tableData.map((data, idx) => {
            return (
              <div
                className="sm:w-1/2 flex flex-col inline-flex
                  w-screen space-y-2 mb-2 h-auto overflow-hidden"
                key={`${data.fdalabel.setid}-${data.idx}`}
              >
                <button
                  className={`
                  rounded text-white border-blue-400
                  border-2 hover:border-blue-800 h-auto
                  p-2
                  hover:bg-blue-800 transition`}
                  key={`${data.fdalabel.setid}-${data.idx}`}
                  onMouseOver={(e) => {
                    setHoverIdx(idx);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(
                      `/annotate/fdalabel/${data.fdalabel.setid}/adverse_effect_table/${data.idx}`,
                    );
                  }}
                >
                  <div className="flex justify-between">
                    <p className="leading-relaxed w-full">
                      {data.fdalabel.tradename} [Table {data.idx}]
                    </p>
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
                    {data.fdalabel.indication
                      ?.split(" ")
                      .splice(0, 20)
                      .join(" ")}{" "}
                    ...
                    <Table
                      {...{
                        content: {
                          table: data.adverse_effect_table.content.table.slice(
                            0,
                            6,
                          ),
                        } as IBaseTable,
                      }}
                    />
                  </p>
                </button>
              </div>
            );
          })}
          <div className="flex justify-center space-x-1 flex-wrap">
            <PaginationBar
              topN={tableData.length * 100}
              pageN={pageN}
              nPerPage={nPerPage}
              setPageN={(i: number) => {
                setPageN(i);
              }}
            />
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
