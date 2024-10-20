"use client";
import { IAdverseEffectTable, UserRoleEnum } from "@/types";
import { useRouter } from "next/navigation";
import { Fragment, useId } from "react";
import { TypographyH2 } from "../typography";
import { Table } from "../table";
import { useAuth } from "@/contexts";

function AdverseReactionSection({
  setid,
  adverse_effect_tables,
}: {
  setid: string;
  adverse_effect_tables: IAdverseEffectTable[];
}) {
  const id = useId();
  const router = useRouter();
  const { role, isLoadingAuth } = useAuth();
  return (
    <Fragment key={id}>
      {(adverse_effect_tables as IAdverseEffectTable[])?.length > 0 && (
        <Fragment key={id}>
          <div className="flex justify-between py-2">
            <TypographyH2>ADVERSE REACTIONS</TypographyH2>
            {!isLoadingAuth && role === UserRoleEnum.ADMIN && (
              <button
                className="bg-red-600 
                    hover:bg-red-700
                    py-2 px-6 rounded
                    text-white
                    "
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/annotate/fdalabel/${setid}`);
                }}
              >
                Annotate
              </button>
            )}
          </div>

          {adverse_effect_tables!.map((tabledata, tableid) => {
            return (
              <Fragment key={`${id}-${tableid}`}>
                <Table {...tabledata} />
                <hr />
              </Fragment>
            );
          })}
        </Fragment>
      )}
    </Fragment>
  );
}

export { AdverseReactionSection };
