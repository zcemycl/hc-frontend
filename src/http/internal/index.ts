import { IData } from "@/types";

export async function fetchApiRoot(token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/private", {
    method: "GET",
    headers,
  });
  return resp;
}

export interface ValidateTokenResult {
  success: boolean;
  status: number;
  message: string;
  data: IData | null;
}

export async function validateToken(
  token: string,
): Promise<ValidateTokenResult> {
  const response = await fetch("/api/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    const err = await response.json();
    return {
      success: false,
      status: response.status,
      message: err.error || response.statusText || "Unknown Error",
      data: null,
    };
  }
  const res = await response.json();
  return {
    success: true,
    status: 200,
    message: "",
    data: res,
  };
}

export * from "./logout";
export * from "./aws";
export * from "./db";
export * from "./cookie";
export * from "./auth";
