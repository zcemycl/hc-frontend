"use client";

import { SearchQueryTypeEnum } from "@/constants";
import { useAuth, useLoader } from "@/contexts";
import { fetchHistoryByIdv2 } from "@/http/backend";
import {
  SearchActionEnum,
  UserHistoryCategoryEnum,
  IHistory,
  HistoryResult,
} from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useApiHandler } from "./useApiHandler";

const useHistoryToSearch = ({
  setQueryType,
  setQuery,
}: {
  setQueryType: Dispatch<SetStateAction<SearchQueryTypeEnum>>;
  setQuery: Dispatch<SetStateAction<string[]>>;
}) => {
  const { handleResponse } = useApiHandler();
  const searchParams = useSearchParams();
  const historyId = searchParams.get("historyId");
  const { withLoading } = useLoader();
  const router = useRouter();
  const { credentials, setIsAuthenticated } = useAuth();
  useEffect(() => {
    console.log("profile history useEffect");
    if (historyId === null) return;
    if (credentials.length === 0) {
      setIsAuthenticated(false);
      router.push("/logout");
    }
    if (historyId !== null) {
      withLoading(() => fetchHistoryByIdv2(parseInt(historyId))).then(
        async (history: HistoryResult) => {
          handleResponse(history);
          if (!history.success) return;
          if (history.data?.category === UserHistoryCategoryEnum.SEARCH) {
            if (history.data?.detail.action === SearchActionEnum.SEARCH) {
              setQueryType(history.data?.detail.additional_settings.queryType);
              setQuery(history.data?.detail.query);
            }
          }
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyId]);
  return {};
};

export { useHistoryToSearch };
