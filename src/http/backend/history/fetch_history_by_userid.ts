import { ApiResult, IHistory } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

interface HistoriesResult extends ApiResult<IHistory[]> {}

export async function fetchHistoryByUserIdv2(
  id: number,
  offset: number = 0,
  limit: number = 10,
): Promise<HistoriesResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/history/${id}?offset=${offset}&limit=${limit}`;
  return apiFetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
