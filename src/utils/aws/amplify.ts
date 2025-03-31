import { signIn as login, confirmSignIn } from "aws-amplify/auth";

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

export { amplifyConfirmSignIn, amplifySignIn };
