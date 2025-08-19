import { ApiResult, IData } from "@/types";

interface ValidateTokenResult extends ApiResult<IData> {}

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
