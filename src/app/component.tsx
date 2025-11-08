"use client";
import { useAuth, useLoader } from "@/contexts";
import Image from "next/image";
import {
  HomeStats,
  Spinner,
  RequestDemoForm,
  FindUsMap,
  HomeContact,
} from "@/components";
import { useDbsHealth } from "@/hooks";
import { DB_CHECK_ICON_URI, DB_X_ICON_URI } from "@/icons/bootstrap";

export default function Component() {
  const { isAuthenticated, userData } = useAuth();
  const { isPGHealthy } = useDbsHealth();
  const { isLoadingv2 } = useLoader();

  return (
    <div className="pb-28 mb-3 sm:pb-10">
      <section
        className={`text-gray-400 bg-gray-900 body-font 
          ${isLoadingv2 ? "animate-pulse" : ""}`}
      >
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
                  isLoadingv2 ? (
                    <div>
                      <Spinner />
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    `${userData?.username ?? ""}`
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
          <div className="w-[600px] h-[300px] rounded-lg sm:mt-6 md:mt-0 relative">
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
