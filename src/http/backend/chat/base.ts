"use server";

import { IChatMessage, ChatMessageResult } from "@/types";
import { get_token_cookie } from "../../utils-server";
import { apiFetch } from "../../utils";
import { FASTAPI_URI } from "../constants";

export async function chatAIv2(message: string): Promise<ChatMessageResult> {
  const token = await get_token_cookie();
  const API_URI = `${FASTAPI_URI}/chat`;

  const params = new URLSearchParams();
  params.append("message", message);

  return apiFetch<IChatMessage>(`${API_URI}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
