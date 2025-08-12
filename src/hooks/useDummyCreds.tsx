"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useDbsHealth } from "./useDbsHealth";
import { fetchUserInfoByName } from "@/http/backend";
import { SiteMode, UserRoleEnum } from "@/types";
import { dummy_cred } from "@/utils";
import { useAuth } from "@/contexts";
import { setPostLogin } from "@/http/internal";

const useDummyCreds = ({
  prevSignal,
  setPrevSignal,
}: {
  prevSignal: string;
  setPrevSignal: Dispatch<SetStateAction<string>>;
}) => {
  const { pgHealthMsg } = useDbsHealth();
  const { setIsAuthenticated, credentials, setRole, setUserId, isLoadingAuth } =
    useAuth();
  useEffect(() => {
    if (isLoadingAuth) return;
    if (prevSignal === pgHealthMsg?.data) return;
    if (process.env.NEXT_PUBLIC_ENV_NAME === "local-dev") {
      console.log("1. Dummy creds for testing without cognito");
      const dummy_username = "leo.leung.rxscope";
      const getDummyInfo = async () => {
        setIsAuthenticated(true);
        const dummyUserInfo = await fetchUserInfoByName(dummy_username);
        setRole(dummyUserInfo?.role as UserRoleEnum);
        setUserId(dummyUserInfo?.id);
        await setPostLogin(
          SiteMode.LOGIN,
          "",
          credentials,
          "3600",
          dummyUserInfo?.id.toString(),
          dummyUserInfo?.role as UserRoleEnum,
        );
      };
      getDummyInfo();
    }
    setPrevSignal(pgHealthMsg?.data as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, pgHealthMsg]);
};

export { useDummyCreds };
