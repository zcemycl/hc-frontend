"use client";
import { ListPageTemplate, ProfileBar, ProtectedRoute } from "@/components";
import { fetchFdalabelBySetidv2 } from "@/http/backend";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const fid = searchParams.get("fdalabel_id");

  const getData = useCallback(async () => {}, [fid]);

  useEffect(() => {
    if (fid === undefined) return;
    fetchFdalabelBySetidv2([fid as string]);
  }, [fid]);
  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <ProfileBar
          {...{
            title: fid as string,
          }}
        />
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
