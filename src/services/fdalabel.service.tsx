import {
  SearchActionEnum,
  TBooleanDummySetState,
  UserHistoryCategoryEnum,
  IFdaVersions,
} from "@/types";
import { BaseServiceHandler } from "./utils";
import {
  addHistoryByUserId,
  fetchFdalabelBySetid,
  fetchFdalabelByIndication,
  fetchFdalabelByTradename,
  fetchFdalabelCompareAdverseEffects,
  fetchFdalabelByTherapeuticArea,
} from "@/http/backend";
import { useRouter } from "next/navigation";
import {
  SearchQueryTypeEnum,
  SortByEnum,
  AETableVerEnum,
  DEFAULT_FDALABEL_VERSIONS,
} from "@/constants";

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

  async handleFdalabelBySetid(
    query: string[],
    // version: AETableVerEnum = AETableVerEnum.v0_0_1,
    versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
  ) {
    try {
      const resp = await fetchFdalabelBySetid(
        query,
        this.topN,
        0,
        -1,
        versions,
      );
      await addHistoryByUserId(
        this.userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.SEARCH,
          query,
          additional_settings: {
            queryType: SearchQueryTypeEnum.SETID,
            versions: versions,
          },
        },
      );
      return resp;
    } catch {
      return [];
    }
  }

  async handleFdalabelByTradename(
    query: string[],
    versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
    // version: AETableVerEnum = AETableVerEnum.v0_0_1,
  ) {
    try {
      const resp = await fetchFdalabelByTradename(
        query,
        this.topN,
        0,
        -1,
        versions,
      );
      await addHistoryByUserId(
        this.userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.SEARCH,
          query,
          additional_settings: {
            queryType: SearchQueryTypeEnum.TRADENAME,
            versions: versions,
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
    // version: AETableVerEnum = AETableVerEnum.v0_0_1,
    versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
  ) {
    try {
      const resp = await fetchFdalabelByIndication(
        query[0],
        this.topN,
        pageN * nPerPage,
        undefined,
        sortBy,
        versions,
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
            // aeVersion: version,
            versions: versions,
          },
        },
      );
      return resp;
    } catch {
      return [];
    }
  }

  async handleFdalabelByTherapeuticArea(
    query: string[],
    pageN: number,
    nPerPage: number,
    sortBy: SortByEnum,
    version: AETableVerEnum = AETableVerEnum.v0_0_1,
  ) {
    try {
      const resp = await fetchFdalabelByTherapeuticArea(
        query[0],
        this.topN,
        pageN * nPerPage,
        undefined,
        sortBy,
        version,
      );
      await addHistoryByUserId(
        this.userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.SEARCH,
          query,
          additional_settings: {
            sortBy,
            queryType: SearchQueryTypeEnum.TA,
            pageN: `${pageN}`,
            nPerPage: `${nPerPage}`,
            aeVersion: version,
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
