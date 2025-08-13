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
import { useRouter } from "next/navigation";

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

export const AuthProvider = ({
  initialData,
  children,
}: {
  initialData: IInitialData;
  children?: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // is Window mounted?
  const [credentials, setCredentials] = useState<string | null>(
    initialData.defaultCredentials ?? "{}",
  );
  const [role, setRole] = useState<UserRoleEnum>(
    initialData.defaultRole ?? UserRoleEnum.USER,
  );
  const [userId, setUserId] = useState<number | null>(
    initialData.defaultUserId ?? null,
  );
  const router = useRouter();
  const { cognitoIdentity, signIn, answerCustomChallenge } = useCognitoAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoadingAuth(false);
    }
  }, []);

  // useEffect(() => {
  //   if (!isLoadingAuth) return;
  //   console.log("mounted window");
  //   const creds = JSON.parse(credentials as string);
  //   console.log(creds);
  //   if ("AccessToken" in creds) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //     setCredentials("{}");
  //   }
  //   setIsLoadingAuth(false);
  // }, [isLoadingAuth, credentials]);

  useEffect(() => {
    async function fetchIsAuthToken(creds: { AccessToken: string }) {
      // set credential to cookie for next backend server
      const resp = await handleFetchApiRoot(
        creds!.AccessToken,
        setIsAuthenticated,
        router,
      );
      const res = await resp.json();
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
      if (isAuthenticated) {
        router.push("/");
      }
    }
    if (typeof window === "undefined" || isLoadingAuth) return;
    console.log("debug...1", credentials);
    const creds = JSON.parse(credentials as string);
    // If credential exists, quit
    if (!Object.keys(creds).length) return;
    console.log("3. Avoid credential injection");
    fetchIsAuthToken(creds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth, credentials, isAuthenticated]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
