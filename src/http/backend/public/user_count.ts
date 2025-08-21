"use server";
import { UserCountResult } from "@/types";
import { FASTAPI_URI } from "../constants";
import { apiFetch } from "../../utils";

export async function fetchUserCountv2(): Promise<UserCountResult> {
  const API_URI = `${FASTAPI_URI}/get_user_count`;
  const res = await apiFetch<number>(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
