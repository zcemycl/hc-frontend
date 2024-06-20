"use client";
import { ProtectedRoute, useAuth } from "@/contexts";
import { JupyterIcon, ChatbotIcon, AnnotateIcon } from "@/icons";
import { redirect } from "next/navigation";
import { useState } from "react";

async function fetchApiAI(token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const resp = await fetch(`/api/private/service/ai`, {
    method: "POST",
    body: JSON.stringify({
      accessKeyId:
        process.env.NEXT_PUBLIC_ENV_NAME === "local-dev"
          ? process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID
          : "",
      secretAccessKey:
        process.env.NEXT_PUBLIC_ENV_NAME === "local-dev"
          ? process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
          : "",
    }),
    headers,
  });
  return await resp.json();
}

export default function AI() {
  const { setIsAuthenticated, credentials } = useAuth();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [jupyterLink, setJupyterLink] = useState("");
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
    "
        >
          <div
            id="default-modal"
            tabIndex={-1}
            aria-hidden="true"
            className={`fixed place-items-center transition-all
            z-10 justify-center items-center w-full md:inset-0 h-full 
            ${isOpenModal ? "scale-100" : "scale-0"}`}
          >
            <div className="relative p-4 w-full h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-1/2 translate-x-1/2 -translate-y-1/2 top-1/2">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Jupyter Lab Link
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 
                          rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center 
                          dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="default-modal"
                    onClick={() => setIsOpenModal(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  <a
                    className="text-base leading-relaxed text-gray-500 dark:text-gray-400 underline"
                    href={jupyterLink}
                    target="_blank"
                  >
                    Click here to open Jupyter Lab ...
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              AI Tools
            </h2>
            <button
              className="text-white bg-red-500 border-0 py-2
                flex justify-start content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-red-600 
                rounded text-2xl w-full"
            >
              <AnnotateIcon />
              Annotation
            </button>
            <button
              className="text-white bg-green-500 border-0 py-2
                flex justify-start content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-green-600 
                rounded text-2xl w-full"
              onClick={async () => {
                console.log("Open JupyterLab");
                if (credentials.length === 0) {
                  setIsAuthenticated(false);
                  redirect("/logout");
                }
                const credJson = JSON.parse(credentials);
                const resp = await fetchApiAI(credJson.AccessToken);
                setJupyterLink(resp.url);
                setIsOpenModal(true);
              }}
            >
              <JupyterIcon />
              Jupyter Lab
            </button>
            <button
              className="text-white bg-blue-500 border-0 py-2
                flex justify-start content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-blue-600 
                rounded text-2xl w-full"
            >
              <ChatbotIcon />
              Chatbot
            </button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
