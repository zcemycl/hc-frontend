import { TBooleanDummySetState } from "@/types";
import { fetchApiRoot } from "@/http/internal";
import { useRouter } from "next/navigation";
import { handle401 } from "./utils";

export async function handleFetchApiRoot(
  token: string,
  setIsAuthenticated?: TBooleanDummySetState,
  router?: ReturnType<typeof useRouter>,
) {
  const resp = await fetchApiRoot(token);
  handle401(resp, setIsAuthenticated, router);
  return resp;
}

export * from "./fdalabel.service";
