"use client";
import { fetchFdalabelHistoryBySetid } from "@/http/backend";
import { IFdaLabelHistory } from "@/types";
import { convert_datetime_to_date } from "@/utils";
import { useRouter } from "next/navigation";
import { TableFromCols } from "../table";
import { TypographyH2 } from "../typography";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts";

function FdaLabelHistory({
  setid,
  displayDataIndex,
}: {
  setid: string;
  displayDataIndex: number | null;
}) {
  const router = useRouter();
  const [displayHistoryData, setDisplayHistoryData] =
    useState<IFdaLabelHistory>({});
  const { credentials, setIsAuthenticated, isLoadingAuth } = useAuth();

  useEffect(() => {
    let resp;
    if (isLoadingAuth) return;
    if (process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev") {
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        router.push("/logout");
      }
    }
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      resp = await fetchFdalabelHistoryBySetid(setid);
      setDisplayHistoryData(resp);
    }
    if (displayDataIndex != null) {
      getData(credentials);
    } else setDisplayHistoryData({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayDataIndex, isLoadingAuth]);

  return (
    <>
      {displayDataIndex != null &&
        displayHistoryData!.setids &&
        displayHistoryData!.setids!.length > 1 && (
          <>
            <TypographyH2>HISTORY</TypographyH2>
            <TableFromCols
              {...{
                keyvalue: {
                  setid: "Set ID",
                  manufacturers: "Manufacturer",
                  spl_earliest_dates: "SPL Earliest Date",
                  spl_effective_dates: "SPL Effective Date",
                },
                data: {
                  setid: displayHistoryData?.setids!,
                  manufacturers: displayHistoryData?.manufacturers!,
                  spl_earliest_dates:
                    displayHistoryData?.spl_earliest_dates!.map((x) =>
                      convert_datetime_to_date(x),
                    ),
                  spl_effective_dates:
                    displayHistoryData?.spl_effective_dates!.map((x) =>
                      convert_datetime_to_date(x),
                    ),
                },
              }}
            />
          </>
        )}
    </>
  );
}

export { FdaLabelHistory };
