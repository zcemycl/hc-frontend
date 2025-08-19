import { apiFetch } from "../../utils";
import { ApiResult, IData } from "@/types";

interface ValidateTokenResult extends ApiResult<IData> {}

export async function validateToken(
  token: string,
): Promise<ValidateTokenResult> {
  const res = await apiFetch<IData>("/api/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  return res;
}
