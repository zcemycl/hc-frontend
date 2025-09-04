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

import { IInitialData, SiteMode, UserRoleEnum } from "@/types";
import { fetchUserInfoByNamev2 } from "@/http/backend";
import { amplifyConfirmSignIn, amplifySignIn } from "@/utils";
import { useCognitoAuth } from "@/hooks";
import { setPostLogin, validateToken } from "@/http/internal";
import { useLoader } from "./loader";
import { useApiHandler } from "@/hooks/useApiHandler";

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
  const { isLoadingv2, withLoading } = useLoader();
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
  const { handleResponse } = useApiHandler();

  useEffect(() => {
    async function fetchIsAuthToken(creds: { AccessToken: string }) {
      const tokenResult = await withLoading(() =>
        validateToken(creds!.AccessToken),
      );
      handleResponse(tokenResult);
      const { username } = tokenResult.data!;
      console.log(username, creds);
      const userInfo = await withLoading(() =>
        fetchUserInfoByNamev2(username as string),
      );
      handleResponse(userInfo);
      if (!userInfo.success) return;
      setRole(userInfo.data?.role as UserRoleEnum);
      setUserId(userInfo.data?.id);
      console.log("tired... ", userInfo);
      await withLoading(() =>
        setPostLogin(
          SiteMode.LOGIN,
          userInfo.data?.email,
          credentials!,
          "3600",
          userInfo.data?.id.toString() as string,
          userInfo.data?.role as UserRoleEnum,
        ),
      );
      setUserData({
        username,
        id: userInfo.data?.id,
        role: userInfo.data?.role,
        email: userInfo.data?.email,
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
