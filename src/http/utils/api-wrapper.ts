import { ApiResult } from "@/types";

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(url, options);

  let errorMessage;
  if (!response.ok) {
    errorMessage = response.statusText || "Unknown Error";
    try {
      const err = await response.json();
      errorMessage = err.error || err.message || errorMessage;
    } catch (e) {
      errorMessage = e;
      // not JSON, stick to statusText
    }

    return {
      success: false,
      status: response.status,
      message: errorMessage,
      data: null,
    };
  }

  const res: T = await response.json();
  return {
    success: true,
    status: response.status,
    message: "",
    data: res,
  };
}
