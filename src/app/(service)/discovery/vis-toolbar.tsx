"use client";

import { useState, useContext } from "react";
import { DiscoveryContext } from "./context";
import InfoTab from "./info-tab";
import FlagTab from "./flag-tab";
import TabBar from "./tab-bar";
import SettingsTab from "./settings-tab";

export default function VisToolbar() {
  const { openToolBar, setOpenToolBar } = useContext(DiscoveryContext);
  return (
    <>
      <button
        className="rounded-lg
          p-3
          self-end
          w-fit
          pointer-events-auto
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
          pointer-events-none
          h-0
          ${
            openToolBar
              ? "h-[60vh] scale-100 opacity-100"
              : "h-0 scale-0 opacity-0"
          }
          w-[80vw] sm:w-[45vw] md:w-[30vw]`}
      >
        <div
          className={`
          relative w-full h-full
          bg-sky-800 rounded-lg
          pointer-events-auto
          ${openToolBar ? "p-5" : "p-0"}`}
        >
          <InfoTab />
          <FlagTab />
          <SettingsTab />
        </div>

        <TabBar />
      </div>
    </>
  );
}
