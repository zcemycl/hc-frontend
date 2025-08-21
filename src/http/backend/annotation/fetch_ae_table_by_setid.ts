"use server";
import {
  AnnotationCategoryEnum,
  ITableNoHead,
  IFdaVersions,
  TableNoHeadResult,
} from "@/types";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function fetchAETableBySetidv2(
  setid: string,
  tablename: AnnotationCategoryEnum = AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
): Promise<TableNoHeadResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annotation/fdalabel/${setid}/${tablename}`;

  return apiFetch<ITableNoHead[]>(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
}
