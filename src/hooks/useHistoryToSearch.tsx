"use client";

import { SearchQueryTypeEnum } from "@/constants";
import { useAuth } from "@/contexts";
import { fetchHistoryById } from "@/http/backend";
import { SearchActionEnum, UserHistoryCategoryEnum } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

const useHistoryToSearch = ({
  setQueryType,
  setQuery,
}: {
  setQueryType: Dispatch<SetStateAction<SearchQueryTypeEnum>>;
  setQuery: Dispatch<SetStateAction<string[]>>;
}) => {
  const searchParams = useSearchParams();
  const historyId = searchParams.get("historyId");
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
      fetchHistoryById(parseInt(historyId)).then(async (history) => {
        if (history.category === UserHistoryCategoryEnum.SEARCH) {
          if (history.detail.action === SearchActionEnum.SEARCH) {
            setQueryType(history.detail.additional_settings.queryType);
            setQuery(history.detail.query);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyId]);
  return {};
};

export { useHistoryToSearch };
