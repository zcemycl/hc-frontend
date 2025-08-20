"use server";
import { FdalabelCountResult } from "@/types";
import { FASTAPI_URI } from "../constants";
import { apiFetch } from "../../utils";

export async function fetchFdalabelCountv2(): Promise<FdalabelCountResult> {
  const API_URI = `${FASTAPI_URI}/get_fdalabel_count`;
  const res = await apiFetch<number>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
