"use client";
import React, { useRef, useEffect } from "react";
import { useOpenBar, useAuth } from "@/contexts";
import Link from "next/link";
import { navbar_dropdown } from "@/constants/navbar-dropdown";
import { useRouter } from "next/navigation";
import { ProfileIcon, LayerIcon, MenuIcon } from "@/icons";
import { DropDownBtn } from "../dropdown";
import Button from "../lightdarktoggle";

export default interface NavBarProps {
  isDark: boolean;
}

export default function NavBar() {
  const { isAuthenticated } = useAuth();
  const { isDropDownOpen, setIsDropDownOpen, isSideBarOpen, setIsSideBarOpen } =
    useOpenBar();
  const refDropDown = useRef(null);
  const refMenuBtn = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleOutSideDropDownClick = ({ target }: Event) => {
      const isInsideDropDown = (
        refDropDown.current as unknown as HTMLDivElement
      )?.contains(target as Node);
      const isInsideMenuBtn = (
        refMenuBtn.current as unknown as HTMLDivElement
      )?.contains(target as Node);
      if (!isInsideDropDown) {
        if (isInsideMenuBtn) {
          return;
        }
        setIsDropDownOpen(false);
      }
    };

    window.addEventListener("mousedown", (e: Event) =>
      handleOutSideDropDownClick(e),
    );

    return () => {
      window.removeEventListener("mousedown", (e: Event) =>
        handleOutSideDropDownClick(e),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refDropDown, refMenuBtn]);
  return (
    <header className="text-gray-400 bg-gray-900 body-font fixed w-full">
      <div className="container justify-between mx-auto flex flex-wrap p-5 flex-row items-center">
        <div className="container justify-between flex">
          <Link
            href="/"
            className="flex title-font font-medium items-center text-white mb-0"
          >
            <LayerIcon />
            <span className="ml-3 text-xl">RXScope</span>
          </Link>
          <nav className="hidden md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	md:flex md:flex-wrap items-center text-base justify-center">
            {navbar_dropdown.map((keyValue) => {
              return (
                <Link
                  href={keyValue.path}
                  key={keyValue.name}
                  className="mr-5 hover:text-white"
                  aria-current="page"
                >
                  {keyValue.name}
                </Link>
              );
            })}
          </nav>
          <div className="ml-4 py-1 pl-4 border-l border-gray-700	flex items-center text-base justify-center">
            <Button />
            <DropDownBtn
              forwardRef={refMenuBtn}
              extraClassName="md:hidden"
              onClick={() => setIsDropDownOpen(!isDropDownOpen)}
            >
              <MenuIcon />
            </DropDownBtn>
            <button
              type="button"
              data-testid="icon-login-btn"
              onClick={() => {
                if (isAuthenticated) {
                  setIsSideBarOpen(!isSideBarOpen);
                } else {
                  router.push("/login");
                }
              }}
              className={`inline-flex items-center p-0 w-10 h-10 justify-center text-sm border-white text-gray-500 rounded-full focus:ring-2 hover:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ${isSideBarOpen ? "pointer-events-none" : ""} cursor-pointer`}
            >
              <ProfileIcon />
            </button>
          </div>
        </div>
        <div className="flex w-full justify-end h-0" ref={refDropDown}>
          <div
            className={`items-center z-10 justify-between w-1/3 sm:w-1/4 md:hidden transition-transform ${isDropDownOpen ? "scale-y-100" : "scale-y-0"}`}
            id="navbar-dropdown"
          >
            <ul className="flex flex-col p-2 md:p-0 mt-1 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse dark:bg-gray-800  dark:border-gray-700">
              <li>
                {navbar_dropdown.map((keyValue) => {
                  return (
                    <Link
                      href={keyValue.path}
                      key={keyValue.name}
                      className="block py-1 px-3 text-right text-gray-900 rounded hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                      aria-current="page"
                    >
                      {keyValue.name}
                    </Link>
                  );
                })}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
