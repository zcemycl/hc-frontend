"use client";

import { useState, useContext } from "react";
import { DiscoveryContext } from "./context";
import InfoTab from "./info-tab";

export default function VisToolbar() {
  const { tab, setTab, openToolBar, setOpenToolBar } =
    useContext(DiscoveryContext);
  return (
    <>
      <button
        className="rounded-lg
                    p-3
                    self-end
                    w-fit
                    text-black leading-5 font-semibold
                    bg-emerald-400 hover:bg-emerald-600"
        onClick={(e) => {
          e.preventDefault();
          setOpenToolBar(!openToolBar);
        }}
      >
        <img
          src="https://icons.getbootstrap.com/assets/icons/tools.svg"
          alt="Toolbar"
        />
      </button>
      <div
        className={`origin-top-right transition
          self-end
          flex flex-col
          ${openToolBar ? "h-[60vh] scale-100" : "h-0 scale-0"}
          w-[80vw] sm:w-[45vw] md:w-[30vw]`}
      >
        <div
          className={`
          relative w-full h-full
          bg-sky-800 rounded-lg
          ${openToolBar ? "p-5" : "p-0"}`}
        >
          <InfoTab />
          <div
            className={`absolute
                left-0 right-0 top-0 bottom-0
                self-end
                space-y-1
                overflow-y-auto
                w-full h-full
                transition
                p-5
                ${tab === "init" ? "opacity-100 z-10 delay-200" : "opacity-0 z-0 duration-200"}
                `}
          >
            <h2 className="leading text-slate-300 font-bold">
              Therapeutic Area
            </h2>
            <input
              type="text"
              className="bg-white text-black w-full rounded-lg h-10 p-2"
              onChange={(e) => {
                e.preventDefault();
                console.log(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex flex-row space-x-2 pl-3">
          <button
            className={`p-2
            ${tab === "info" ? "bg-sky-800 border-b-2" : "bg-sky-500"}
            rounded-b-lg hover:bg-sky-800`}
            onClick={() => setTab("info")}
          >
            <img src="https://icons.getbootstrap.com/assets/icons/info-circle-fill.svg" />
          </button>
          <button
            className={`p-2
            ${tab === "init" ? "bg-sky-800 border-b-2" : "bg-sky-500"}
            rounded-b-lg hover:bg-sky-800`}
            onClick={() => setTab("init")}
          >
            <img src="https://icons.getbootstrap.com/assets/icons/flag.svg" />
          </button>
          <button
            className={`p-2 
            ${tab === "settings" ? "bg-sky-800 border-b-2" : "bg-sky-500"}
            rounded-b-lg hover:bg-sky-800`}
            onClick={() => setTab("settings")}
          >
            <img src="https://icons.getbootstrap.com/assets/icons/sliders.svg" />
          </button>
        </div>
      </div>
    </>
  );
}
