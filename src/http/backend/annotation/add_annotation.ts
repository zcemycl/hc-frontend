"use server";
import { EmptyResult } from "@/types";
import { FASTAPI_URI } from "../constants";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";

export async function addAnnotationByNameIdv2(
  id: number,
  name: string,
  annotation: { [key: string]: any },
): Promise<EmptyResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annotation/add/fdalabel/${name}/${id}`;

  const res = await apiFetch<any>(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(annotation),
  });
  return res;
}
