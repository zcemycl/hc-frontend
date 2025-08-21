"use client";
import { useRouter } from "next/navigation";
import { ApiResult } from "@/types";

export function useApiHandler() {
  const router = useRouter();

  const handleResponse = <T,>(result: ApiResult<T>) => {
    switch (result.status) {
      case 200:
        return result;

      case 401:
        // redirect to logout
        router.push(
          process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/logout" : "/",
        );
        return null;

      case 404:
        // stay on page, show Not Found
        return {
          ...result,
          message: result.message || "Not Found",
        };

      case 500:
        // stay on page, show error
        return {
          ...result,
          message: result.message || "Internal Server Error",
        };

      default:
        return result;
    }
  };

  return { handleResponse };
}
