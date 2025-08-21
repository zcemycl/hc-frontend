"use server";
import { AnnotationCategoryEnum, CountResult } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function fetchAnnotatedCountByUserIdv2(
  user_id: number,
  tablename: AnnotationCategoryEnum,
): Promise<CountResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annotation/user/${user_id}/annotated/${tablename}`;

  return apiFetch<number>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
