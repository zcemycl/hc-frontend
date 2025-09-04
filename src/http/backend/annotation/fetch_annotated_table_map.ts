"use server";
import { IFdaVersions, IGenericMap, GenericMapResult } from "@/types";
import { DEFAULT_FDALABEL_VERSIONS } from "@/constants";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function fetchAnnotatedTableMapByNameIdsv2(
  id: number,
  name: string,
  is_ai: boolean = false,
  versions: IFdaVersions = DEFAULT_FDALABEL_VERSIONS,
): Promise<GenericMapResult> {
  const token = await get_token_cookie();
  const params = new URLSearchParams();
  params.append("is_ai", is_ai.toString());
  const API_URI = `${FASTAPI_URI}/annotation/annotated/${name}/${id}?${params}`;

  return apiFetch<IGenericMap>(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(versions),
  });
}
