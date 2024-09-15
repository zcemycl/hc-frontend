import {
  SearchActionEnum,
  TBooleanDummySetState,
  UserHistoryCategoryEnum,
} from "@/types";
import { handle401, BaseServiceHandler } from "./utils";
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
    const resp = await fetchFdalabelBySetid(query, this.topN, 0, -1);
    this.handle401(resp);
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
  }

  async handleFdalabelByTradename(query: string[]) {
    const resp = await fetchFdalabelByTradename(query, this.topN, 0, -1);
    this.handle401(resp);
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
  }

  async handleFdalabelByIndication(
    query: string[],
    pageN: number,
    nPerPage: number,
    sortBy: SortByEnum,
  ) {
    const resp = await fetchFdalabelByIndication(
      query[0],
      this.topN,
      pageN * nPerPage,
      undefined,
      sortBy,
    );
    this.handle401(resp);
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
  }
}
