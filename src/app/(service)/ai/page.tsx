"use client";
import { ProtectedRoute, useAuth } from "@/contexts";
import { create_presigned_url } from "@/http/internal";
import { JupyterIcon, ChatbotIcon, AnnotateIcon } from "@/icons";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { UserRoleEnum } from "@/types/users";
import { Modal } from "@/components";

export default function AI() {
  const router = useRouter();
  const { setIsAuthenticated, credentials, role } = useAuth();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [jupyterLink, setJupyterLink] = useState("");
  const isNotAdmin = role !== UserRoleEnum.ADMIN;
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
    "
        >
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
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              AI Tools
            </h2>
            <button
              type="button"
              className="text-white bg-red-500 border-0 py-2
                flex justify-between content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-red-600 
                rounded text-2xl w-full"
              onClick={() => router.push("/annotate")}
            >
              <p>Annotation</p>
              <AnnotateIcon />
            </button>
            <button
              disabled={isNotAdmin}
              type="button"
              title={isNotAdmin ? "Disabled by Admin, Please contact us." : ""}
              className={`focus:outline-none border-0 py-2
                flex justify-between content-center text-center
                align-middle items-center text-white
                px-6 ${isNotAdmin ? "bg-slate-500" : "bg-green-500 hover:bg-green-600"}
                rounded text-2xl w-full`}
              onClick={async () => {
                console.log("Open JupyterLab");
                if (credentials.length === 0) {
                  setIsAuthenticated(false);
                  redirect("/logout");
                }
                const credJson = JSON.parse(credentials);
                const resp = await create_presigned_url(credJson.AccessToken);
                setJupyterLink(resp.url);
                setIsOpenModal(true);
              }}
            >
              <p>Jupyter Lab</p>
              <JupyterIcon />
            </button>
            <button
              type="button"
              className="text-white bg-blue-500 border-0 py-2
                flex justify-between content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-blue-600 
                rounded text-2xl w-full"
              onClick={() => router.push("/chatbot")}
            >
              <p>Chatbot</p>
              <ChatbotIcon />
            </button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
