import { TBooleanDummySetState } from "@/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function handle401(
  resp: Response,
  setIsAuthenticated?: TBooleanDummySetState,
  router?: AppRouterInstance,
) {
  if (resp.status === 401) {
    if (setIsAuthenticated !== undefined) setIsAuthenticated(false);
    if (router !== undefined) router.push("/logout");
  }
}
