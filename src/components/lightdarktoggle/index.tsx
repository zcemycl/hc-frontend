"use client";
import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/icons";

function Button() {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") ?? "dark";
    setTheme(currentTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <button
      onClick={() => {
        if (theme == "dark") {
          localStorage.setItem("theme", "light");
          setTheme("light");
        } else {
          localStorage.setItem("theme", "dark");
          setTheme("dark");
        }
      }}
      className="
              w-12
              h-6
              rounded-full
              p-1
              mr-2
              bg-blue-700
              dark:bg-gray-600
              relative
              transition-colors
              duration-500
              ease-in
              focus:outline-none
              focus:ring-2
              focus:ring-blue-700
              dark:focus:ring-blue-600
              focus:border-transparent
              flex-end
          "
    >
      <div className="w-4 h-4 absolute left-1">
        <MoonIcon />
      </div>
      <div className="w-4 h-4 absolute dark:hidden right-1 border-black">
        <SunIcon />
      </div>
      <div
        id="toggle"
        className="
              rounded-full
              w-4
              h-4
              bg-white
              dark:bg-blue-500
              relative
              ml-0
              dark:ml-6
              pointer-events-none
              transition-all
              duration-300
              ease-out
          "
      ></div>
    </button>
  );
}

export default Button;
