"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts";
import { SiteMode } from "./types";
import { UserRoleEnum } from "@/types";
import { fetchUserInfoByName } from "@/http/backend";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isAuthenticated,
    setRole,
    setIsAuthenticated,
    signIn,
    answerCustomChallenge,
    setCredentials,
    setUserId,
    isLoadingAuth,
  } = useAuth();
  const [email, setEmail] = useState<string>("");
  const urlCode = searchParams.get("code") ?? "";
  const urlEmail = decodeURIComponent(searchParams.get("email") ?? "");
  const [mode, setMode] = useState<SiteMode>(SiteMode.LOGIN);

  const submitCallback = async function (email: string) {
    const resp = await signIn(email);
    localStorage.setItem("cognito_user", JSON.stringify(resp));
    localStorage.setItem("mode", SiteMode.VERIFY);
    localStorage.setItem("email", email);
    router.push("/prelogin");
  };

  useEffect(() => {
    if (isLoadingAuth) return;
    const curMode = localStorage.getItem("mode") ?? SiteMode.LOGIN;
    setMode(curMode as SiteMode);
    const curEmail = localStorage.getItem("email") ?? "";
    setEmail(curEmail);
  }, [isLoadingAuth]);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (isAuthenticated) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoadingAuth]);

  useEffect(() => {
    async function respondAuthChallege(
      urlCode: string,
      urlEmail: string,
      isAuthenticated: boolean,
    ) {
      const cognito_user = JSON.parse(
        localStorage.getItem("cognito_user") as string,
      );
      if (
        urlCode &&
        urlEmail &&
        "Session" in cognito_user &&
        mode === SiteMode.VERIFY &&
        !isAuthenticated
      ) {
        const sessionLoginId = cognito_user.Session;
        console.log(urlCode);
        const resp = await answerCustomChallenge(
          sessionLoginId,
          urlCode,
          urlEmail,
        );
        setMode(SiteMode.LOGIN);
        localStorage.setItem("mode", SiteMode.LOGIN);
        const expiresAt =
          new Date().getTime() / 1000 + resp.AuthenticationResult?.ExpiresIn!;
        const credentials = JSON.stringify(resp.AuthenticationResult);
        localStorage.setItem("credentials", credentials);
        setCredentials(credentials);
        const resp_user = await fetchUserInfoByName(
          cognito_user.ChallengeParameters.USERNAME,
          resp.AuthenticationResult?.AccessToken as string,
        );
        setRole(resp_user.role as UserRoleEnum);
        setUserId(resp_user.id);
        localStorage.setItem("expireAt", expiresAt.toString());
        if (
          resp &&
          Object.keys(resp).length === 0 &&
          resp.constructor === Object
        ) {
          return;
        }

        setIsAuthenticated(true);
      }
    }
    if (isLoadingAuth) return;
    respondAuthChallege(urlCode, urlEmail, isAuthenticated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCode, urlEmail, isAuthenticated, mode, isLoadingAuth]);

  return (
    <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
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
              console.log("submit email??");
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
