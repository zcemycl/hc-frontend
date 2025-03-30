import { Dispatch, SetStateAction } from "react";
import {
  booleanDummySetState,
  stringDummySetState,
  TBooleanDummySetState,
  TStringDummySetState,
} from "./factory";
import { UserRoleEnum } from "./users";
import {
  CognitoIdentityProviderClient,
  InitiateAuthResponse,
  RespondToAuthChallengeResponse,
} from "@aws-sdk/client-cognito-identity-provider";

export interface AuthContextType {
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

export const defaultAuthContext = {
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
};
