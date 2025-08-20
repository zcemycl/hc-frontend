"use server";
import {
  AnnotationCategoryEnum,
  IUnAnnotatedAETable,
  IFdaVersions,
  UnannotatedAETableResult,
} from "@/types";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function fetchUnannotatedAETableByUserIdv2(
  id: number,
  tablename: AnnotationCategoryEnum = AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
  offset: number = 10,
  limit: number = 10,
  reverse: boolean = false,
  complete: boolean = false,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
  isHistory: boolean = false,
): Promise<UnannotatedAETableResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annotation/${id}/unannotated_ae_tables/${tablename}`;
  const params = new URLSearchParams();
  params.append("offset", offset.toString());
  params.append("limit", limit.toString());
  params.append("reverse", reverse.toString());
  params.append("complete", complete.toString());
  params.append("isHistory", isHistory.toString());
  const API_URI_PAGINATION = `${API_URI}?${params}`;

  return apiFetch<IUnAnnotatedAETable[]>(API_URI_PAGINATION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
}
