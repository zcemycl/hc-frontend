"use client";

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthRequest,
  InitiateAuthResponse,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeRequest,
  RespondToAuthChallengeResponse,
} from "@aws-sdk/client-cognito-identity-provider";

const useCognitoAuth = () => {
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

  return { cognitoIdentity, signIn, answerCustomChallenge };
};

export { useCognitoAuth };
