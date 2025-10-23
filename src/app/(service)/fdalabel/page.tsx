"use client";
import {
  FdaLabel,
  ListPageTemplate,
  ProfileBar,
  ProtectedRoute,
} from "@/components";
import { FdaVersionsContext, useLoader } from "@/contexts";
import { useApiHandler } from "@/hooks";
import { fetchFdalabelBySetidv2 } from "@/http/backend";
import { IFdaLabel } from "@/types";
import { useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const fid = searchParams.get("fdalabel_id");
  const { versions } = useContext(FdaVersionsContext);
  const { withLoading } = useLoader();
  const [displayData, setDisplayData] = useState<IFdaLabel[]>([]);
  const { handleResponse } = useApiHandler();

  const getData = useCallback(async () => {
    const res = await withLoading(() =>
      fetchFdalabelBySetidv2([fid as string], 1, 0, 1, versions),
    );
    if (!res.success) handleResponse(res);
    setDisplayData(res.data || []);
  }, [fid]);

  useEffect(() => {
    if (fid === undefined) return;
    getData();
  }, [fid]);

  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <ProfileBar
          {...{
            title: "",
          }}
        />
        {displayData.length > 0 && (
          <FdaLabel
            each={displayData?.[0]}
            displayDataIndex={0}
            back_btn_callback={undefined}
            versions={versions}
          />
        )}
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
