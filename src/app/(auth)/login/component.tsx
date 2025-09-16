"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LocalGenericContext, useAuth, useLoader } from "@/contexts";
import { SiteMode } from "@/types";
import { setPreLogin } from "@/http/internal";
import { PulseTemplate } from "@/components";

export default function Component() {
  const router = useRouter();
  const {
    isAuthenticated,
    signIn,
    answerCustomChallenge,
    setCredentials,
    isLoadingAuth,
  } = useAuth();
  const { withLoading, isLoadingv2 } = useLoader();
  const { initialData } = useContext(LocalGenericContext);
  const { urlCode, urlEmail, defaultMode, defaultEmail, cognito_user } =
    initialData;
  const [email, setEmail] = useState<string>(defaultEmail);
  const [mode, setMode] = useState<SiteMode>(defaultMode);

  const submitCallback = async function (email: string) {
    const resp = await withLoading(() => signIn(email));
    const resp_string = JSON.stringify(resp);
    await setPreLogin(SiteMode.VERIFY, email, resp_string);
    router.push("/prelogin");
  };

  useEffect(() => {
    if (isLoadingv2) return;
    if (isAuthenticated) {
      console.log("logged in , redirect to home page");
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoadingv2]);

  useEffect(() => {
    if (isLoadingAuth) return;
    async function respondAuthChallege(
      urlCode: string,
      urlEmail: string,
      isAuthenticated: boolean,
    ) {
      const cognito_user_obj = JSON.parse(cognito_user);
      if (
        urlCode &&
        urlEmail &&
        "Session" in cognito_user_obj &&
        mode === SiteMode.VERIFY &&
        !isAuthenticated
      ) {
        console.log("Login Verifying...");
        const sessionLoginId = cognito_user_obj.Session;
        const resp = await withLoading(() =>
          answerCustomChallenge(sessionLoginId, urlCode, urlEmail),
        );
        console.log("setting mode...");
        setMode(SiteMode.LOGIN);
        // const expiresAt =
        //   new Date().getTime() / 1000 + resp.AuthenticationResult?.ExpiresIn!;
        const credentials = JSON.stringify(resp.AuthenticationResult);
        setCredentials(credentials);
        console.log("setting creds...");
      }
    }
    respondAuthChallege(urlCode, urlEmail, isAuthenticated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCode, urlEmail, isAuthenticated, mode, isLoadingAuth]);

  return (
    <PulseTemplate>
      <div
        className="container px-2 py-24 mx-auto grid justify-items-center
        "
      >
        <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10">
          <h2 className="text-white text-lg mb-1 font-medium title-font">
            Login
          </h2>
          <p className="leading-relaxed mb-5">
            Please enter your email to retrieve a login link in your mailbox.
          </p>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              data-testid="login-email-input"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            data-testid="login-email-submit-btn"
            onClick={async (e) => {
              e.preventDefault();
              await withLoading(() => submitCallback(email));
            }}
            className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          >
            Submit
          </button>
          <p className="text-xs text-gray-400 text-opacity-90 mt-3">
            Not registered? Submit a Demo Request Form at{" "}
            <Link href="/">Home Page</Link>.
          </p>
        </div>
      </div>
    </PulseTemplate>
  );
}
