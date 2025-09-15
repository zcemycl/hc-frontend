"use client";

import { ApiErrResponseContext } from "@/contexts";
import { useContext } from "react";
import Modal from "./generic";
import { useRouter } from "next/navigation";

const Handler500 = () => {
  return (
    <>
      <span>Oopss... Something went wrong.</span>
      <span>If the issue persists, please contact us.</span>
    </>
  );
};

const Handler404 = () => {
  return (
    <>
      <span>The content you are searching are not available.</span>
      <span>Please search another term.</span>
      <span>
        Otherwise, contact us, we would love to enhance our product with you.
      </span>
    </>
  );
};

const Handler403 = () => {
  const router = useRouter();
  return (
    <>
      <span>Oh no, your login session has expired.</span>
      <span>Click the button below to sign out, and log in again.</span>
      <button
        className="bg-red-500 hover:bg-red-600
            p-2 rounded-lg text-white"
        onClick={(e) => {
          e.preventDefault();
          router.push("/logout");
        }}
      >
        Logout
      </button>
    </>
  );
};

export const HandleNotOKResponseModal = () => {
  const {
    openErrModal,
    setOpenErrModal,
    statusCode,
    errMsg: message,
  } = useContext(ApiErrResponseContext);

  const renderContent = () => {
    switch (statusCode) {
      case 500:
        return <Handler500 />;
      case 404:
        return <Handler404 />;
      case 403:
        return <Handler403 />;
      case 401:
        return <Handler403 />;
      default:
        return <></>;
    }
  };

  return (
    <Modal
      {...{
        title: `${statusCode}: ${message}`,
        isOpenModal: openErrModal,
        setIsOpenModal: setOpenErrModal,
      }}
    >
      <div className="flex flex-col space-y-2 pb-6 px-5 font-bold">
        {renderContent()}
      </div>
    </Modal>
  );
};
