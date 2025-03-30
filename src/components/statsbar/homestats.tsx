"use client";
import { useAuth } from "@/contexts";
import { useDbsHealth } from "@/hooks";
import { fetchFdalabelCount, fetchUserCount } from "@/http/backend";
import { beautifulNumber } from "@/http/utils";
import { useEffect, useState } from "react";

const HomeStats = () => {
  const { isLoadingAuth } = useAuth();
  const [fdalabelCount, setFdalabelCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [prevSignal, setPrevSignal] = useState<string>("False");
  const { pgHealthMsg, isPGHealthy } = useDbsHealth();

  useEffect(() => {
    if (isLoadingAuth) return;
    if (prevSignal === pgHealthMsg?.data) return;
    if (pgHealthMsg?.data == "True") {
      fetchFdalabelCount().then((x) => setFdalabelCount(x));
      fetchUserCount().then((x) => setUserCount(x));
    }
    setPrevSignal(pgHealthMsg?.data as string);
  }, [isLoadingAuth, pgHealthMsg]);

  return (
    <>
      <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
        <h2 className="title-font font-medium text-3xl text-white">
          {beautifulNumber(fdalabelCount)}
        </h2>
        <p className="leading-relaxed">Drugs</p>
      </div>
      <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
        <h2 className="title-font font-medium text-3xl text-white">
          {userCount}
        </h2>
        <p className="leading-relaxed">Users</p>
      </div>
      <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
        <h2 className="title-font font-medium text-3xl text-white">1</h2>
        <p className="leading-relaxed">Data Sources</p>
      </div>
      <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
        <h2 className="title-font font-medium text-3xl text-white">1</h2>
        <p className="leading-relaxed">Products</p>
      </div>
    </>
  );
};

export { HomeStats };
