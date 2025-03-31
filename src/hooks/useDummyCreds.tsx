"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useDbsHealth } from "./useDbsHealth";
import { fetchUserInfoByName } from "@/http/backend";
import { UserRoleEnum } from "@/types";
import { dummy_cred } from "@/utils";
import { useAuth } from "@/contexts";

const useDummyCreds = ({
  prevSignal,
  setPrevSignal,
}: {
  prevSignal: string;
  setPrevSignal: Dispatch<SetStateAction<string>>;
}) => {
  const { pgHealthMsg } = useDbsHealth();
  const {
    setIsAuthenticated,
    setCredentials,
    setRole,
    setUserId,
    isLoadingAuth,
  } = useAuth();
  useEffect(() => {
    if (isLoadingAuth) return;
    if (prevSignal === pgHealthMsg?.data) return;
    if (process.env.NEXT_PUBLIC_ENV_NAME === "local-dev") {
      console.log("1. Dummy creds for testing without cognito");
      const dummy_username = "leo.leung.rxscope";
      const getDummyInfo = async () => {
        const act = await dummy_cred(dummy_username);
        const credentials = JSON.stringify({
          AccessToken: act,
          ExpiresIn: 3600,
          IdToken: "",
          RefreshToken: "",
          TokenType: "Bearer",
        });
        setCredentials(credentials);
        setIsAuthenticated(true);
        localStorage.setItem("credentials", credentials);
        const dummyUserInfo = await fetchUserInfoByName(dummy_username);
        setRole(dummyUserInfo?.role as UserRoleEnum);
        setUserId(dummyUserInfo?.id);
      };
      getDummyInfo();
    }
    setPrevSignal(pgHealthMsg?.data as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, pgHealthMsg]);
};

export { useDummyCreds };
