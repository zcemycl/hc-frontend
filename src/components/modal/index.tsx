"use client";
import { FC, ReactNode } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  isOpenModal: boolean;
  setIsOpenModal: (state: boolean) => void;
}

const Modal: FC<ModalProps> = ({
  title,
  children,
  isOpenModal,
  setIsOpenModal,
}) => {
  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={`fixed place-items-center transition-all
            inset-0
            z-10 justify-center items-center w-full md:inset-0 h-full 
            ${isOpenModal ? "scale-100" : "scale-0"}`}
    >
      <div
        className="relative 
        p-2 sm:p-4 
        w-full h-full"
      >
        <div
          className="relative bg-white rounded-lg shadow 
          dark:bg-gray-700 
          w-full sm:w-1/2 
          translate-x-0 sm:translate-x-1/2 
          -translate-y-3/4 sm:-translate-y-1/2 
          top-1/2"
        >
          <div
            className="flex items-center justify-between 
            p-1 md:p-5 
            order-b rounded-t dark:border-gray-600"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
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
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
