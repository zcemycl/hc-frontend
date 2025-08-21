"use server";
import { AnnotationCategoryEnum, IFdaVersions, CountResult } from "@/types";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function fetchUnannotatedAETableByUserIdCountv2(
  id: number,
  tablename: AnnotationCategoryEnum = AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
  reverse: boolean = false,
  complete: boolean = false,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
): Promise<CountResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annotation/${id}/unannotated_ae_tables_count/${tablename}`;
  const params = new URLSearchParams();
  params.append("reverse", reverse.toString());
  params.append("complete", complete.toString());
  const API_URI_PAGINATION = `${API_URI}?${params}`;

  return apiFetch<number>(API_URI_PAGINATION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
}
