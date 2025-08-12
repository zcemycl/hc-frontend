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

export const AuthProvider = ({
  defaultCredentials,
  children,
}: {
  defaultCredentials: string;
  children?: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // is Window mounted?
  const [credentials, setCredentials] = useState<string>(defaultCredentials);
  const [role, setRole] = useState<UserRoleEnum>(UserRoleEnum.USER);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const { cognitoIdentity, signIn, answerCustomChallenge } = useCognitoAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingAuth) return;
    console.log("mounted window");
    const creds = JSON.parse(defaultCredentials as string);
    console.log(creds);
    if ("AccessToken" in creds) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setCredentials("{}");
    }
    setIsLoadingAuth(false);
  }, [isLoadingAuth]);

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
      if ("username" in res)
        return { isAuthToken: true, username: res.username };
      return { isAuthToken: false, username: "" };
    }
    if (typeof window === "undefined" || isLoadingAuth) return;
    const creds = JSON.parse(credentials as string);
    // If credential exists, quit
    if (!creds) return;
    console.log("3. Avoid credential injection");
    fetchIsAuthToken(creds).then(({ isAuthToken, username }) => {
      console.log(isAuthToken, username);
      console.log(creds);
      if (!isAuthToken) {
        localStorage.clear();
        setIsAuthenticated(false);
        setCredentials("{}");
        router.push(
          process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/login" : "/",
        );
        return;
      }

      fetchUserInfoByName(username as string).then(async (x) => {
        setRole(x.role as UserRoleEnum);
        setUserId(x.id);
        await setPostLogin(
          SiteMode.LOGIN,
          "",
          credentials,
          "3600",
          x.id.toString(),
          x.role as UserRoleEnum,
        );
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

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
