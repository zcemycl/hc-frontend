"use client";
import { useAuth } from "@/contexts";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IData } from "@/types";
import {
  HomeStats,
  Spinner,
  RequestDemoForm,
  FindUsMap,
  HomeContact,
} from "@/components";
import { handleFetchApiRoot } from "@/services";
import { useDbsHealth, useDummyCreds } from "@/hooks";
import { DB_CHECK_ICON_URI, DB_X_ICON_URI } from "@/icons/bootstrap";

export default function Component() {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, credentials, setRole } =
    useAuth();
  const [data, setData] = useState<IData>({});
  const [prevSignal, setPrevSignal] = useState<string>("False");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { pgHealthMsg, isPGHealthy } = useDbsHealth();
  // useDummyCreds({ prevSignal, setPrevSignal }); // only trigger when local

  useEffect(() => {
    if (credentials.length === 0) return;
    if (prevSignal === pgHealthMsg?.data) return;
    console.log("2 Set cookie creds");
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      if (!("AccessToken" in credJson)) {
        return;
      }
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
    <div>
      <section className="text-gray-400 bg-gray-900 body-font">
        <div
          className="container px-5 py-24 mx-auto md:flex md:flex-between
          overflow-x-hidden"
        >
          <div
            className="flex flex-wrap -mx-4 
            mt-auto mb-auto lg:w-1/2 sm:w-2/3 
            content-start sm:pr-10"
          >
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
                    <img src={DB_CHECK_ICON_URI} alt="connected" />
                  </div>
                ) : (
                  <div className="bg-red-400 text-black font-bold w-fit p-2 rounded-xl animate-pulse">
                    <img src={DB_X_ICON_URI} alt="connecting" />
                  </div>
                )}
              </div>
            </div>
            <HomeStats />
          </div>
          <div className="w-[600px] h-[300px] rounded-lg sm:mt-6 md:mt-0">
            <Image
              className="object-none md:object-center object-top 
                w-full h-full overflow-visible"
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
          <div
            className="lg:w-2/3 md:w-1/2 w-full
            bg-gray-900 rounded-lg
            h-[60vh] sm:h-auto
            overflow-hidden sm:mr-10 p-10
            flex items-end justify-start relative"
          >
            <FindUsMap />
            <HomeContact />
          </div>
          <RequestDemoForm />
        </div>
      </section>
    </div>
  );
}
