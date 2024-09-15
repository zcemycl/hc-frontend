"use client";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Amplify } from "aws-amplify";
import { defaultStorage } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthRequest,
  InitiateAuthResponse,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeRequest,
  RespondToAuthChallengeResponse,
} from "@aws-sdk/client-cognito-identity-provider";
// import { CognitoIdentity } from "@aws-sdk/client-cognito-identity";
import { redirect, useRouter } from "next/navigation";
import { signIn as login, confirmSignIn } from "aws-amplify/auth";
import { UserRoleEnum } from "@/types/users";
// import CognitoProvider from "next-auth/providers/cognito";
import {
  booleanDummySetState,
  stringDummySetState,
  TBooleanDummySetState,
  TStringDummySetState,
} from "@/types";
import { fetchApiRoot } from "@/http/internal";
import { fetchUserInfoByName } from "@/http/backend";

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

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: TBooleanDummySetState;
  isLoadingAuth: boolean;
  setIsLoadingAuth: TBooleanDummySetState;
  credentials: string;
  setCredentials: TStringDummySetState;
  role: UserRoleEnum;
  setRole: Dispatch<SetStateAction<UserRoleEnum>>;
  userId: number | null;
  setUserId: Dispatch<SetStateAction<number | null>>;
  signIn: (email: string) => Promise<InitiateAuthResponse>;
  cognitoIdentity: CognitoIdentityProviderClient;
  answerCustomChallenge: (
    sessionId: string,
    code: string,
    email: string,
  ) => Promise<RespondToAuthChallengeResponse>;
  amplifySignIn: (email: string) => {};
  amplifyConfirmSignIn: (email: string, code: string) => {};
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: booleanDummySetState,
  isLoadingAuth: true,
  setIsLoadingAuth: booleanDummySetState,
  signIn: function (email: string): Promise<InitiateAuthResponse> {
    throw new Error("Function not implemented.");
  },
  cognitoIdentity: new CognitoIdentityProviderClient(),
  answerCustomChallenge: function (
    sessionId: string,
    code: string,
    email: string,
  ): Promise<RespondToAuthChallengeResponse> {
    throw new Error("Function not implemented.");
  },
  amplifySignIn: function (email: string): {} {
    throw new Error("Function not implemented.");
  },
  amplifyConfirmSignIn: function (email: string, code: string) {
    throw new Error("Function not implemented.");
  },
  credentials: "",
  setCredentials: stringDummySetState,
  role: UserRoleEnum.USER,
  setRole: function (value: React.SetStateAction<UserRoleEnum>): void {
    throw new Error("Function not implemented.");
  },
  userId: null,
  setUserId: function (value: React.SetStateAction<number | null>): void {
    throw new Error("Function not implemented.");
  },
});

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [credentials, setCredentials] = useState<string>("");
  const [role, setRole] = useState<UserRoleEnum>(UserRoleEnum.USER);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  // const cognitoidentity = new CognitoIdentity({
  //   region: process.env.NEXT_PUBLIC_AWS_REGION,
  // });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingAuth) return;
    console.log("mounted window");
    const creds = JSON.parse(localStorage.getItem("credentials") as string);
    console.log(creds);
    if (!!creds) {
      setIsAuthenticated(true);
      setCredentials(JSON.stringify(creds));
    } else {
      setIsAuthenticated(false);
      setCredentials("");
    }
    setIsLoadingAuth(false);
  }, [isLoadingAuth]);

  useEffect(() => {
    async function fetchIsAuthToken(creds: { AccessToken: string }) {
      const resp = await fetchApiRoot(creds!.AccessToken);
      console.log(resp);
      const res = await resp.json();
      console.log(res);
      if ("success" in res && !res.success) {
        router.push(
          process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/login" : "/",
        );
      }
      if ("username" in res)
        return { isAuthToken: true, username: res.username };
      return { isAuthToken: false, username: "" };
    }
    console.log("testing window");
    if (typeof window === "undefined" || isLoadingAuth) return;
    const creds = JSON.parse(localStorage.getItem("credentials") as string);
    console.log("testing window2", creds);
    if (!creds) return;
    fetchIsAuthToken(creds).then(({ isAuthToken, username }) => {
      console.log(isAuthToken, username);
      console.log(creds);
      if (!isAuthToken) {
        localStorage.clear();
        setIsAuthenticated(false);
        setCredentials("");
        router.push(
          process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/login" : "/",
        );
        return;
      }

      fetchUserInfoByName(username as string).then((x) => {
        setRole(x.role as UserRoleEnum);
        setUserId(x.id);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

  useEffect(() => {
    if (localStorage.getItem("credentials")) return;
    if (localStorage.getItem("expireAt")) return;
    const credJson = JSON.parse(localStorage.getItem("credentials") as string);
    const expireAt = parseFloat(localStorage.getItem("expireAt") as string);
    if (new Date().getTime() / 1000 < expireAt && "AccessToken" in credJson) {
      setIsAuthenticated(true);
      setCredentials(localStorage.getItem("credentials") ?? "");
    }
  }, []);

  const AuthProviderValue = useMemo<AuthContextType>(() => {
    const cognitoIdentity = new CognitoIdentityProviderClient({
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    });
    async function signIn(email: string) {
      const params: InitiateAuthRequest = {
        AuthFlow: "CUSTOM_AUTH",
        ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOL_CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
        },
      };
      const command = new InitiateAuthCommand(params);
      try {
        const response: InitiateAuthResponse =
          await cognitoIdentity.send(command);
        return response;
      } catch (err) {
        console.log(err);
        return {};
      }
    }

    async function answerCustomChallenge(
      sessionId: string,
      code: string,
      email: string,
    ) {
      const params: RespondToAuthChallengeRequest = {
        ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOL_CLIENT_ID,
        ChallengeName: "CUSTOM_CHALLENGE",
        Session: sessionId,
        ChallengeResponses: { USERNAME: email, ANSWER: code },
      };
      const command = new RespondToAuthChallengeCommand(params);
      try {
        const response: RespondToAuthChallengeResponse =
          await cognitoIdentity.send(command);
        return response;
      } catch (err) {
        console.log(err);
        return {};
      }
    }

    async function amplifySignIn(email: string) {
      const resp = await login({
        username: email,
        options: { authFlowType: "CUSTOM_WITHOUT_SRP" },
      });
      return resp;
    }

    async function amplifyConfirmSignIn(code: string) {
      const resp = await confirmSignIn({
        challengeResponse: code,
      });
      return resp;
    }
    return {
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
    };
  }, [
    isAuthenticated,
    setIsAuthenticated,
    isLoadingAuth,
    setIsLoadingAuth,
    credentials,
    setCredentials,
    role,
    setRole,
    userId,
    setUserId,
  ]);

  return (
    <AuthContext.Provider value={AuthProviderValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  if (typeof window === "undefined") {
    console.log("window not mounted");
    return children;
  }
  console.log("window mounted");
  const creds = JSON.parse(localStorage.getItem("credentials") as string);
  let isAuthenticated = false;
  if (!!creds) {
    isAuthenticated = true;
  }
  if (!isAuthenticated) {
    console.log("trigger redirect");
    router.push(
      process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/login" : "/",
    );
  }
  return children;
};
