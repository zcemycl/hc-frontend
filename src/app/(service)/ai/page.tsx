"use client";
import { useAuth, useLoader } from "@/contexts";
import { create_presigned_url } from "@/http/internal";
import { JupyterIcon, ChatbotIcon, AnnotateIcon, DiscoveryIcon } from "@/icons";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserRoleEnum } from "@/types/users";
import {
  Modal,
  Spinner,
  TypographyH2,
  ProtectedRoute,
  BackBtn,
} from "@/components";
import { useStopLoadingEarly } from "@/hooks";

export default function AI() {
  const router = useRouter();
  const { setIsAuthenticated, credentials, role, isLoadingAuth } = useAuth();
  const { isLoading, setIsLoading } = useLoader();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [jupyterLink, setJupyterLink] = useState("");
  const isNotAdmin = role !== UserRoleEnum.ADMIN;
  useStopLoadingEarly();

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
          h-[81vh] sm:h-[89vh]
        ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          {(isLoading || isLoadingAuth) && (
            <div
              role="status"
              className="absolute left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2"
            >
              <Spinner />
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <Modal
            title="Jupyter Lab Link"
            isOpenModal={isOpenModal}
            setIsOpenModal={() => setIsOpenModal(false)}
          >
            <div className="p-4 md:p-5 space-y-4">
              <a
                className="text-base leading-relaxed text-gray-500 dark:text-gray-400 underline"
                href={jupyterLink}
                target="_blank"
              >
                Click here to open Jupyter Lab ...
              </a>
            </div>
          </Modal>
          <div
            className="
            sm:w-11/12 md:w-7/12 w-full
            flex flex-col mt-8
            p-1 sm:p-10 
            space-y-2"
          >
            <div className="flex flex-row justify-between">
              <TypographyH2>AI Tools</TypographyH2>
              <BackBtn />
            </div>

            <p className="leading-relaxed mb-5">
              Tools to explore, align and train our AI models.
            </p>
            <button
              type="button"
              className="text-white bg-red-500 border-0 py-3
                flex justify-between content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-red-600 
                rounded text-2xl w-full"
              onClick={() => router.push("/annotate")}
            >
              <p>Annotation</p>
              <AnnotateIcon />
            </button>
            <p className="px-6 mb-1 text-xs text-right">
              Create benchmark dataset to train and evaluate.
            </p>

            <button
              type="button"
              className="text-white bg-orange-500 border-0 py-3
                flex justify-between content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-orange-600 
                rounded text-2xl w-full"
              onClick={() => router.push("/discovery")}
            >
              <p className="text-center align-middle">Discovery</p>
              <DiscoveryIcon />
            </button>
            <p className="px-6 mb-1 text-xs text-right">
              Discovery Drug with graphs.
            </p>

            <button
              disabled={isNotAdmin}
              type="button"
              title={isNotAdmin ? "Disabled by Admin, Please contact us." : ""}
              className={`focus:outline-none border-0 py-3
                flex justify-between content-center text-center
                align-middle items-center text-white
                px-6 ${isNotAdmin ? "bg-slate-500" : "bg-green-500 hover:bg-green-600"}
                rounded text-2xl w-full`}
              onClick={async () => {
                console.log("Open JupyterLab");
                setIsLoading(true);
                if (credentials.length === 0) {
                  setIsAuthenticated(false);
                  router.push("/logout");
                }
                const resp = await create_presigned_url();
                setJupyterLink(resp.url);
                setIsOpenModal(true);
                setIsLoading(false);
              }}
            >
              <p>Jupyter Lab</p>
              <JupyterIcon />
            </button>
            <p className="px-6 mb-1 text-xs text-right">
              Explore new data and machine learning model.
            </p>
            <button
              type="button"
              className="text-white bg-blue-500 border-0 py-3
                flex justify-between content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-blue-600 
                rounded text-2xl w-full"
              onClick={() => router.push("/chatbot")}
            >
              <p>Chatbot</p>
              <ChatbotIcon />
            </button>
            <p className="px-6 mb-1 text-xs text-right">
              Test AI Assistant to discover and compare drugs.
            </p>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
