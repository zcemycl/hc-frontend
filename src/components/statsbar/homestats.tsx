"use client";
import { LocalGenericContext } from "@/contexts";
import { setFdalabelCount } from "@/http/internal";
import { beautifulNumber } from "@/http/utils";
import { useContext, useEffect } from "react";

const HomeStats = () => {
  const { initialData } = useContext(LocalGenericContext);
  const { hasFdalabelCountCookie, fdalabelCount, userCount } = initialData;

  useEffect(() => {
    async function setCookieSelf() {
      if (!hasFdalabelCountCookie) {
        await setFdalabelCount(initialData.fdalabelCount);
      }
    }
    setCookieSelf();
  }, []);

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
