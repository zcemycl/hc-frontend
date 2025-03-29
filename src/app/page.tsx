"use client";
import { useAuth } from "@/contexts";
import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { IData, IRequestDemoForm, UserRoleEnum } from "@/types";
import { sendEmail } from "@/http/internal";
import { dummy_cred } from "@/utils";
import {
  fetchFdalabelCount,
  fetchUserCount,
  fetchUserInfoByName,
} from "@/http/backend";
import { HomeStats, Spinner, RequestDemoForm } from "@/components";
import { handleFetchApiRoot } from "@/services";
import { useDbsHealth } from "@/hooks";

export default function Home() {
  const router = useRouter();
  const {
    isAuthenticated,
    setIsAuthenticated,
    credentials,
    setCredentials,
    setRole,
    setUserId,
    isLoadingAuth,
  } = useAuth();
  const [data, setData] = useState<IData>({});
  const [prevSignal, setPrevSignal] = useState<string>("False");
  const [fdalabelCount, setFdalabelCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { pgHealthMsg, isPGHealthy } = useDbsHealth();

  useEffect(() => {
    if (isLoadingAuth) return;
    if (process.env.NEXT_PUBLIC_ENV_NAME === "local-dev") {
      const dummy_username = "leo.leung.rxscope";
      dummy_cred(dummy_username).then((x) => {
        const credentials = JSON.stringify({
          AccessToken: x,
          ExpiresIn: 3600,
          IdToken: "",
          RefreshToken: "",
          TokenType: "Bearer",
        });
        setCredentials(credentials);
        setIsAuthenticated(true);
        localStorage.setItem("credentials", credentials);
        fetchUserInfoByName(dummy_username).then((x) => {
          console.log(x);
          setRole(x.role as UserRoleEnum);
          setUserId(x.id);
        });
      });
    }

    fetchFdalabelCount().then((x) => setFdalabelCount(x));
    fetchUserCount().then((x) => setUserCount(x));
    setPrevSignal(pgHealthMsg?.data as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

  useEffect(() => {
    if (credentials.length === 0) return;
    if (prevSignal === pgHealthMsg?.data) return;
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      const resp = await handleFetchApiRoot(
        credJson.AccessToken,
        setIsAuthenticated,
        router,
      );
      const res = await resp.json();
      if (process.env.NEXT_PUBLIC_ENV_NAME === "local-dev") {
        setRole(res.role);
      }
      setData(res);
      setIsLoading(false);
    }
    getData(credentials);
    setPrevSignal(pgHealthMsg?.data as string);
  }, [credentials, pgHealthMsg]);

  return (
    <>
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-24 mx-auto md:flex md:flex-between">
          <div className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
            <div className="w-full sm:p-4 px-4 mb-6 space-y-1">
              <h1 className="title-font font-medium text-xl mb-2 text-white">
                Hello{" "}
                {isAuthenticated ? (
                  isLoading ? (
                    <div>
                      <Spinner />
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    `${data!.username}`
                  )
                ) : (
                  ""
                )}
              </h1>
              <div className="leading-relaxed">
                Welcome to RXScope Platform!{" "}
                {isAuthenticated
                  ? ""
                  : "Please Login to start using our Tools."}
              </div>
              <div>
                {isPGHealthy ? (
                  <div className="bg-emerald-400 text-black font-bold w-fit p-2 rounded-xl">
                    <img
                      src="https://icons.getbootstrap.com/assets/icons/database-check.svg"
                      alt="connected"
                    />
                  </div>
                ) : (
                  <div className="bg-red-400 text-black font-bold w-fit p-2 rounded-xl animate-pulse">
                    <img
                      src="https://icons.getbootstrap.com/assets/icons/database-x.svg"
                      alt="connecting"
                    />
                  </div>
                )}
              </div>
            </div>
            <HomeStats {...{ fdalabelCount, userCount }} />
          </div>
          <div className="w-[600px] h-[300px] rounded-lg sm:mt-6 md:mt-0">
            <Image
              className="object-none md:object-center object-top w-full h-full overflow-visible"
              src="/images/neo4j.png"
              alt="stats"
              width={600}
              height={300}
              priority
            />
          </div>
        </div>
      </section>
      <section className="text-gray-400 bg-gray-900 body-font relative">
        <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-2/3 md:w-1/2 bg-gray-900 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
            {/* https://www.maps.ie/create-google-map/ */}
            <iframe
              width="100%"
              height="100%"
              title="map"
              className="absolute inset-0"
              style={{
                filter: "grayscale(0) contrast(1) opacity(0.8)",
                border: 0,
                overflow: "hidden",
                margin: 0,
              }}
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=London+(RXScope)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            ></iframe>
            <div className="bg-gray-900 relative flex flex-wrap py-6 rounded shadow-md">
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-white tracking-widest text-xs">
                  EMAIL
                </h2>
                <a className="text-indigo-400 leading-relaxed">
                  l.leung@rxscope.co.uk
                </a>
                <h2 className="title-font font-semibold text-white tracking-widest text-xs mt-4">
                  PHONE
                </h2>
                <p className="leading-relaxed">+447543781301</p>
              </div>
            </div>
          </div>
          <RequestDemoForm />
        </div>
      </section>
    </>
  );
}
