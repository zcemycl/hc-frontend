"use client";

import { SearchQueryTypeEnum } from "@/constants";
import { useAuth, useLoader } from "@/contexts";
import { fetchBundleByIdv2 } from "@/http/backend";
import { BundleResult, IBundle } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

const useBundleToSearch = ({
  setQueryType,
  setQuery,
}: {
  setQueryType: Dispatch<SetStateAction<SearchQueryTypeEnum>>;
  setQuery: Dispatch<SetStateAction<string[]>>;
}) => {
  const searchParams = useSearchParams();
  const bundleId = searchParams.get("bundleId");
  const router = useRouter();
  const { withLoading } = useLoader();
  const { credentials, setIsAuthenticated } = useAuth();
  useEffect(() => {
    console.log("profile history useEffect");
    if (bundleId === null) return;
    if (credentials.length === 0) {
      setIsAuthenticated(false);
      router.push("/logout");
    }
    if (bundleId !== null) {
      withLoading(() => fetchBundleByIdv2(bundleId)).then(
        async (bundle: BundleResult) => {
          if (bundle.success) {
            setQueryType(SearchQueryTypeEnum.SETID);
            setQuery(bundle.data?.fdalabels.map((f) => f.setid) as string[]);
          }
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundleId]);

  return {};
};

export { useBundleToSearch };
