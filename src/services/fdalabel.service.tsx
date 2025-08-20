import {
  SearchActionEnum,
  TBooleanDummySetState,
  UserHistoryCategoryEnum,
  IFdaVersions,
} from "@/types";
import { BaseServiceHandler } from "./utils";
import {
  addHistoryByUserId,
  fetchFdalabelBySetidv2,
  fetchFdalabelByIndicationv2,
  fetchFdalabelByTradenamev2,
  fetchFdalabelCompareAdverseEffectsv2,
  fetchFdalabelByTherapeuticAreav2,
} from "@/http/backend";
import { useRouter } from "next/navigation";
import {
  SearchQueryTypeEnum,
  SortByEnum,
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
    versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
  ) {
    try {
      const resp = await fetchFdalabelBySetidv2(
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
      return {
        success: false,
        data: null,
        message: "Error fetching fdalabel by setid",
        status: 500,
      };
    }
  }

  async handleFdalabelByTradename(
    query: string[],
    versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
  ) {
    try {
      const resp = await fetchFdalabelByTradenamev2(
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
      return {
        success: false,
        data: null,
        message: "Error fetching fdalabel by tradename",
        status: 500,
      };
    }
  }

  async handleFdalabelByIndication(
    query: string[],
    pageN: number,
    nPerPage: number,
    sortBy: SortByEnum,
    versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
  ) {
    try {
      const resp = await fetchFdalabelByIndicationv2(
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
      return {
        success: false,
        data: null,
        message: "Error fetching fdalabel by indication",
        status: 500,
      };
    }
  }

  async handleFdalabelByTherapeuticArea(
    query: string[],
    pageN: number,
    nPerPage: number,
    sortBy: SortByEnum,
    versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
  ) {
    try {
      const resp = await fetchFdalabelByTherapeuticAreav2(
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
            queryType: SearchQueryTypeEnum.TA,
            pageN: `${pageN}`,
            nPerPage: `${nPerPage}`,
            versions: versions,
          },
        },
      );
      return resp;
    } catch {
      return {
        success: false,
        data: null,
        message: "Error fetching fdalabel by therapeutic area",
        status: 500,
      };
    }
  }

  async handleAETablesComparison(
    setIdsToCompare: Set<string>,
    query: string[],
    queryType: SearchQueryTypeEnum,
    versions: IFdaVersions,
  ) {
    try {
      const arrSetIdsToCompare = Array.from(setIdsToCompare);
      const resp = await fetchFdalabelCompareAdverseEffectsv2(
        arrSetIdsToCompare,
        versions,
      );
      await addHistoryByUserId(
        this.userId as number,
        UserHistoryCategoryEnum.SEARCH,
        {
          action: SearchActionEnum.COMPARE_AE,
          query: arrSetIdsToCompare as string[],
          additional_settings: {
            query,
            queryType,
            versions,
          },
        },
      );
      return resp;
    } catch {
      return {
        success: false,
        data: null,
        message: "Error fetching fdalabel compare adverse effects",
        status: 500,
      };
    }
  }
}
