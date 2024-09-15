"use client";
import { useState, useEffect } from "react";
import {
  fetchFdalabelByIndication,
  fetchFdalabelByTradename,
  fetchFdalabelBySetid,
  fetchFdalabelCompareAdverseEffects,
  addHistoryByUserId,
  fetchHistoryById,
} from "@/http/backend";
import {
  IFdaLabel,
  ICompareAETable,
  SearchActionEnum,
  UserHistoryCategoryEnum,
  IHistory,
} from "@/types";
import { useAuth } from "@/contexts";

const useFetchFdalabelBySetid = ({
  query,
  topN,
}: {
  query: string[];
  topN: number;
}) => {
  const [data, setData] = useState<IFdaLabel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { credentials, userId, isLoadingAuth } = useAuth();

  useEffect(() => {
    const fetchFdalabel = async () => {
      setLoading(true);
      try {
        const label = await fetchFdalabelBySetid(query, topN, 0, -1);
        setData(label);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    if (isLoadingAuth) return;
    if (!userId) return;
    if (credentials.length === 0) return;
    fetchFdalabel();
  }, [credentials, userId, isLoadingAuth]);

  return { data, loading, error };
};

const useFetchFdalabel = () => {};

export { useFetchFdalabelBySetid, useFetchFdalabel };
