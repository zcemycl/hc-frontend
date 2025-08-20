import { HistoriesResult, IHistory } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function fetchHistoryByUserIdv2(
  id: number,
  offset: number = 0,
  limit: number = 10,
): Promise<HistoriesResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/history/${id}`;
  const params = new URLSearchParams();
  params.append("offset", offset.toString());
  params.append("limit", limit.toString());
  const API_URI_PAGINATION = `${API_URI}?${params}`;

  return apiFetch<IHistory[]>(API_URI_PAGINATION, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
