import { TBooleanDummySetState } from "@/types";
import { fetchApiRoot } from "@/http/internal";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { handle401 } from "./utils";

export async function handleFetchApiRoot(
  token: string,
  setIsAuthenticated?: TBooleanDummySetState,
  router?: AppRouterInstance,
) {
  const resp = await fetchApiRoot(token);
  handle401(resp, setIsAuthenticated, router);
  return resp;
}
