"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LocalGenericContext, useAuth, useLoader } from "@/contexts";
import { SiteMode } from "@/types";
import { Spinner } from "@/components";
import { setPreLogin } from "@/http/internal";

export default function Component() {
  const router = useRouter();
  const {
    isAuthenticated,
    signIn,
    answerCustomChallenge,
    setCredentials,
    isLoadingAuth,
  } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const { initialData } = useContext(LocalGenericContext);
  const { urlCode, urlEmail, defaultMode, defaultEmail, cognito_user } =
    initialData;
  const [email, setEmail] = useState<string>(defaultEmail);
  const [mode, setMode] = useState<SiteMode>(defaultMode);

  const submitCallback = async function (email: string) {
    const resp = await signIn(email);
    const resp_string = JSON.stringify(resp);
    await setPreLogin(SiteMode.VERIFY, email, resp_string);
    router.push("/prelogin");
  };

  useEffect(() => {
    if (isLoadingAuth) return;
    if (isAuthenticated) {
      console.log("logged in , redirect to home page");
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoadingAuth]);

  useEffect(() => {
    if (isLoadingAuth) return;
    setIsLoading(true);
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
        setIsLoading(true);
        console.log("Login Verifying...");
        const sessionLoginId = cognito_user_obj.Session;
        const resp = await answerCustomChallenge(
          sessionLoginId,
          urlCode,
          urlEmail,
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
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCode, urlEmail, isAuthenticated, mode, isLoadingAuth]);

  return (
    <section
      className={`text-gray-400 bg-gray-900 body-font h-[81vh] 
      sm:h-[89vh] ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
    >
      <div
        className="container px-2 py-24 mx-auto grid justify-items-center
        "
      >
        {(isLoading || isLoadingAuth) && (
          <div
            role="status"
            className="absolute left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2"
          >
            <Spinner />
            <span className="sr-only">Loading...</span>
          </div>
        )}
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
              await submitCallback(email);
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
    </section>
  );
}
