"use client";
import { sendEmail } from "@/http/internal";
import { IRequestDemoForm } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RequestDemoForm = () => {
  const router = useRouter();
  const defaultRequestForm = {
    name: "",
    email: "",
    message: "",
  };
  const [requestForm, setRequestForm] =
    useState<IRequestDemoForm>(defaultRequestForm);

  async function handleSubmitRequestForm() {
    const resp = await sendEmail(requestForm);
    const tmpRequestForm = {
      ...requestForm,
      message: "",
    };
    setRequestForm(tmpRequestForm);
    localStorage.setItem("requestForm", JSON.stringify(tmpRequestForm));
    router.push("/requestaccount");
  }

  useEffect(() => {
    const requestFormJson =
      JSON.parse(localStorage.getItem("requestForm") as string) ??
      defaultRequestForm;
    setRequestForm(requestFormJson);
  }, []);

  return (
    <div className="lg:w-1/3 md:w-1/2 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
      <h2 className="text-white text-lg mb-1 font-medium title-font">
        Demo Request Form
      </h2>
      <p className="leading-relaxed mb-5">
        Please fill in and submit the request form. We would contact you if you
        are eligible for demo.
      </p>
      <div className="relative mb-4">
        <label htmlFor="name" className="leading-7 text-sm text-gray-400">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={requestForm.name}
          onChange={(e) => {
            const tmpRequestForm = {
              ...requestForm,
              name: e.currentTarget.value,
            };
            setRequestForm(tmpRequestForm);
            localStorage.setItem("requestForm", JSON.stringify(tmpRequestForm));
          }}
          className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div className="relative mb-4">
        <label htmlFor="email" className="leading-7 text-sm text-gray-400">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={requestForm.email}
          onChange={(e) => {
            const tmpRequestForm = {
              ...requestForm,
              email: e.currentTarget.value,
            };
            setRequestForm(tmpRequestForm);
            localStorage.setItem("requestForm", JSON.stringify(tmpRequestForm));
          }}
          className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div className="relative mb-4">
        <label htmlFor="message" className="leading-7 text-sm text-gray-400">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={requestForm.message}
          onChange={(e) => {
            const tmpRequestForm = {
              ...requestForm,
              message: e.currentTarget.value,
            };
            setRequestForm(tmpRequestForm);
            localStorage.setItem("requestForm", JSON.stringify(tmpRequestForm));
          }}
          className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
        ></textarea>
      </div>
      <button
        onClick={async () => await handleSubmitRequestForm()}
        className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        Submit
      </button>
    </div>
  );
};

export { RequestDemoForm };
