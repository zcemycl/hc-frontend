"use server";
import {
  AnnotationCategoryEnum,
  IAdverseEffectTable,
  IFdaVersions,
  AETableResult,
} from "@/types";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function fetchAETableByIdsv2(
  id: number,
  tablename: AnnotationCategoryEnum,
  setid: string,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
): Promise<AETableResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annotation/fdalabel/${setid}/${tablename}/${id}`;

  return apiFetch<IAdverseEffectTable>(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
}
