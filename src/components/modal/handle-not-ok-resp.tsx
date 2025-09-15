"use client";

import { ApiErrResponseContext } from "@/contexts";
import { useContext } from "react";
import Modal from "./generic";
import { useRouter } from "next/navigation";

const Handler500 = () => {
  return (
    <>
      <span>Oops… Something went wrong on our side.</span>
      <span>Please try again in a moment. </span>
      <span>
        If the problem continues, contact us and we’ll look into it right away.
      </span>
    </>
  );
};

const Handler404 = () => {
  return (
    <>
      <span>We couldn’t find the content you’re looking for.</span>
      <span>Try searching with a different term.</span>
      <span>
        If you still can’t find it, contact us — we’d love your feedback to
        improve our product.
      </span>
    </>
  );
};

const Handler403 = () => {
  const router = useRouter();
  return (
    <>
      <span className="font-semibold">Your session has expired.</span>
      <span>Please log in again to continue.</span>
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
