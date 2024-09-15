import {
  SearchActionEnum,
  TBooleanDummySetState,
  UserHistoryCategoryEnum,
} from "@/types";
import { BaseServiceHandler } from "./utils";
import {
  addHistoryByUserId,
  fetchFdalabelBySetid,
  fetchFdalabelByIndication,
  fetchFdalabelByTradename,
  fetchFdalabelCompareAdverseEffects,
} from "@/http/backend";
import { useRouter } from "next/navigation";
import { SearchQueryTypeEnum, SortByEnum } from "@/constants";

export class FdalabelFetchService extends BaseServiceHandler {
  userId: number;
  topN: number;
  constructor(
    userId: number,
    topN: number,
    setIsAuthenticated?: TBooleanDummySetState,
    router?: ReturnType<typeof useRouter>,
  ) {
    super(setIsAuthenticated, router);
    this.userId = userId;
    this.topN = topN;
  }

  async handleFdalabelBySetid(query: string[]) {
    try {
      const resp = await fetchFdalabelBySetid(query, this.topN, 0, -1);
      await addHistoryByUserId(
        this.userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.SEARCH,
          query,
          additional_settings: {
            queryType: SearchQueryTypeEnum.SETID,
          },
        },
      );
      return resp;
    } catch {
      return [];
    }
  }

  async handleFdalabelByTradename(query: string[]) {
    try {
      const resp = await fetchFdalabelByTradename(query, this.topN, 0, -1);
      await addHistoryByUserId(
        this.userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.SEARCH,
          query,
          additional_settings: {
            queryType: SearchQueryTypeEnum.TRADENAME,
          },
        },
      );
      return resp;
    } catch {
      return [];
    }
  }

  async handleFdalabelByIndication(
    query: string[],
    pageN: number,
    nPerPage: number,
    sortBy: SortByEnum,
  ) {
    try {
      const resp = await fetchFdalabelByIndication(
        query[0],
        this.topN,
        pageN * nPerPage,
        undefined,
        sortBy,
      );
      await addHistoryByUserId(
        this.userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.SEARCH,
          query,
          additional_settings: {
            sortBy,
            queryType: SearchQueryTypeEnum.INDICATION,
            pageN: `${pageN}`,
            nPerPage: `${nPerPage}`,
          },
        },
      );
      return resp;
    } catch {
      return [];
    }
  }

  async handleAETablesComparison(
    setIdsToCompare: Set<string>,
    query: string[],
    queryType: SearchQueryTypeEnum,
  ) {
    try {
      const arrSetIdsToCompare = Array.from(setIdsToCompare);
      const resp = await fetchFdalabelCompareAdverseEffects(arrSetIdsToCompare);
      await addHistoryByUserId(
        this.userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.COMPARE_AE,
          query: arrSetIdsToCompare as string[],
          additional_settings: {
            query,
            queryType,
          },
        },
      );
      return resp;
    } catch {
      return { table: [] };
    }
  }
}
