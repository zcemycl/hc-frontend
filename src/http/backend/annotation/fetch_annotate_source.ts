"use server";
import {
  AnnotateSourceMapResult,
  IAnnotationSourceMap,
  IFdaVersions,
} from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";

export async function fetchAnnotateSourcev2(
  ids: number[],
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
): Promise<AnnotateSourceMapResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annotation/origin`;
  let ids_param = ids.join("&id=");
  return apiFetch<IAnnotationSourceMap>(`${API_URI}?id=${ids_param}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
}
