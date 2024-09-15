import { TBooleanDummySetState } from "@/types";
import { useRouter } from "next/navigation";

export class BaseServiceHandler {
  setIsAuthenticated: TBooleanDummySetState | undefined;
  router: ReturnType<typeof useRouter> | undefined;
  constructor(
    setIsAuthenticated?: TBooleanDummySetState,
    router?: ReturnType<typeof useRouter>,
  ) {
    this.setIsAuthenticated = setIsAuthenticated;
    this.router = router;
  }

  handle401(resp: Response) {
    if (resp.status === 401) {
      if (this.setIsAuthenticated !== undefined) this.setIsAuthenticated(false);
      if (this.router !== undefined) this.router.push("/logout");
    }
  }
}

export function handle401(
  resp: Response,
  setIsAuthenticated?: TBooleanDummySetState,
  router?: ReturnType<typeof useRouter>,
) {
  if (resp.status === 401) {
    if (setIsAuthenticated !== undefined) setIsAuthenticated(false);
    if (router !== undefined) router.push("/logout");
  }
}
