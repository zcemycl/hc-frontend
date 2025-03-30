import { Dispatch, SetStateAction } from "react";
import { TBooleanDummySetState, TStringDummySetState } from "./factory";
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
