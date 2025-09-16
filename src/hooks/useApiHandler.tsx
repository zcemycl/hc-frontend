"use client";
import { useRouter } from "next/navigation";
import { ApiResult } from "@/types";
import { ApiErrResponseContext } from "@/contexts";
import { useContext } from "react";

export function useApiHandler() {
  const router = useRouter();
  const { setErrMsg, setOpenErrModal, setStatusCode } = useContext(
    ApiErrResponseContext,
  );

  const handleResponse = <T,>(result: ApiResult<T>) => {
    switch (result.status) {
      case 200:
        setStatusCode(result.status);
        setErrMsg("");
        setOpenErrModal(false);
        return result;

      case 401:
        // redirect to logout
        setStatusCode(result.status);
        setErrMsg(result.message);
        setOpenErrModal(false);
        router.push(
          process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/logout" : "/",
        );
        return null;

      case 403:
        setStatusCode(result.status);
        setErrMsg(result.message);
        setOpenErrModal(true);
        return null;

      case 404:
        // stay on page, show Not Found
        setStatusCode(result.status);
        setErrMsg(result.message);
        setOpenErrModal(true);
        return {
          ...result,
          message: result.message || "Not Found",
        };

      case 500:
        // stay on page, show error
        setStatusCode(result.status);
        setErrMsg("Internal Server Error");
        setOpenErrModal(true);
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
