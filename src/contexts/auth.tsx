"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Amplify } from "aws-amplify";
import { defaultStorage } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { useRouter, usePathname } from "next/navigation";

import {
  AuthContextType,
  SiteMode,
  UserRoleEnum,
  defaultAuthContext,
} from "@/types";
import { fetchUserInfoByName } from "@/http/backend";
import { handleFetchApiRoot } from "@/services";
import { amplifyConfirmSignIn, amplifySignIn } from "@/utils";
import { useCognitoAuth } from "@/hooks";
import { setPostLogin } from "@/http/internal";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: process.env
        .NEXT_PUBLIC_AWS_COGNITO_USERPOOL_CLIENT_ID as string,
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOL_ID as string,
      loginWith: { email: true },
    },
  },
});

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

export const AuthContext = createContext<any>({});

type IInitialData = Record<string, any>;
type IUserData = {
  username?: string;
  id?: number;
  role?: UserRoleEnum;
  email?: string;
};

export const AuthProvider = ({
  initialData,
  children,
}: {
  initialData: IInitialData;
  children?: React.ReactNode;
}) => {
  const pathname = usePathname();
  const {
    hasCreds,
    defaultCredentials,
    hasUsername,
    defaultUsername,
    hasRole,
    defaultRole,
    hasUserId,
    defaultUserId,
  } = initialData;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // is Window mounted?
  const [credentials, setCredentials] = useState<string | null>(
    defaultCredentials ?? "{}",
  );
  const [userData, setUserData] = useState<IUserData | null>({
    username: defaultUsername,
    id: defaultUserId,
    role: defaultRole,
  });
  const [role, setRole] = useState<UserRoleEnum>(
    defaultRole ?? UserRoleEnum.USER,
  );
  const [userId, setUserId] = useState<number | null>(defaultUserId ?? null);
  const router = useRouter();
  const { cognitoIdentity, signIn, answerCustomChallenge } = useCognitoAuth();
  const hasAuthCookie = hasCreds && hasUsername && hasRole && hasUserId;

  useEffect(() => {
    async function fetchIsAuthToken(creds: { AccessToken: string }) {
      // set credential to cookie for next backend server
      const resp = await handleFetchApiRoot(
        creds!.AccessToken,
        setIsAuthenticated,
        router,
      );
      const res = await resp.json();
      // If creds expired or not correct
      if ("success" in res && !res.success) {
        router.push(
          process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/login" : "/",
        );
      }
      let IsAuthTokenUsername = { isAuthToken: false, username: "" };
      if ("username" in res)
        IsAuthTokenUsername = { isAuthToken: true, username: res.username };
      const { isAuthToken, username } = IsAuthTokenUsername;
      console.log(isAuthToken, username);
      console.log(creds);
      if (!isAuthToken) {
        setIsAuthenticated(false);
        setCredentials("{}");
        router.push(
          process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/login" : "/",
        );
        return;
      }
      const x = await fetchUserInfoByName(username as string);
      setRole(x.role as UserRoleEnum);
      setUserId(x.id);
      console.log("tired... ", x);
      await setPostLogin(
        SiteMode.LOGIN,
        x.email,
        credentials!,
        "3600",
        x.id.toString() as string,
        x.role as UserRoleEnum,
      );
      setUserData({
        username,
        id: x.id,
        role: x.role,
        email: x.email,
      });
      setIsAuthenticated(true);
      if (isAuthenticated) {
        router.push(pathname === "/login" ? "/" : pathname);
      }
    }
    if (typeof window === "undefined") return;
    console.log("hello world!!", credentials, hasAuthCookie);
    // (assumption) if all credentials userdata exist,
    // skip authenticating because user have logged in.
    if (hasAuthCookie) {
      console.log("has cred cookie exit");
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return;
    }
    const creds = JSON.parse(credentials as string);
    // If credential empty, quit
    // for first loading, no discovery of credentials
    // stop authenticating because user is not logged in.
    if (!Object.keys(creds).length && isLoadingAuth) {
      console.log("no cred exit");
      setIsLoadingAuth(false);
      return;
    }
    // 1. reauthenicate any userdata
    // 2. login workflow (isLoadingAuth = false, credentials setstate)
    if (Object.keys(creds).length && !isLoadingAuth) {
      console.log("3. Avoid credential injection");
      fetchIsAuthToken(creds);
    }
    setIsLoadingAuth(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials, isLoadingAuth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isLoadingAuth,
        setIsLoadingAuth,
        credentials,
        setCredentials,
        cognitoIdentity,
        signIn,
        answerCustomChallenge,
        amplifySignIn,
        amplifyConfirmSignIn,
        role,
        setRole,
        userId,
        setUserId,
        userData,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
