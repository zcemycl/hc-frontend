"use client";
import React, { createContext, useState } from "react";

export const ApiErrResponseContext = createContext<any>({});

export const ApiErrResponseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openErrModal, setOpenErrModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [statusCode, setStatusCode] = useState(200);

  return (
    <ApiErrResponseContext.Provider
      value={{
        openErrModal,
        setOpenErrModal,
        errMsg,
        setErrMsg,
        statusCode,
        setStatusCode,
      }}
    >
      {children}
    </ApiErrResponseContext.Provider>
  );
};
