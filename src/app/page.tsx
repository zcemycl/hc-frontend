"use client";
import { useAuth } from "@/contexts";
import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { IRequestDemoForm } from "@/types/home";

import { fetchApiRoot } from "@/http/internal";
import { sendEmail } from "@/http/internal/aws/ses";

import { dummy_cred } from "@/utils";
import { UserRoleEnum } from "@/types/users";

interface IData {
  success?: boolean;
  message?: string;
  id?: number;
  username?: string;
}

export default function Home() {
  const router = useRouter();
  const {
    isAuthenticated,
    setIsAuthenticated,
    credentials,
    setCredentials,
    setRole,
  } = useAuth();
  const [data, setData] = useState<IData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    dummy_cred().then((x) => {
      if (process.env.NEXT_PUBLIC_ENV_NAME === "local-dev") {
        const credentials = JSON.stringify({
          AccessToken: x,
          ExpiresIn: 3600,
          IdToken: "",
          RefreshToken: "",
          TokenType: "Bearer",
        });
        setCredentials(credentials);
        setIsAuthenticated(true);
        // setRole(UserRoleEnum.ADMIN);
        setRole(UserRoleEnum.USER);
        localStorage.setItem("credentials", credentials);
      }
    });

    const requestFormJson =
      JSON.parse(localStorage.getItem("requestForm") as string) ??
      defaultRequestForm;
    setRequestForm(requestFormJson);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (credentials.length === 0) return;
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      const resp = await fetchApiRoot(1, credJson.AccessToken);
      if (isAuthenticated && resp.status === 401) {
        setIsAuthenticated(false);
        redirect("/logout");
      }
      const res = await resp.json();
      setData(res);
      setIsLoading(false);
    }
    getData(credentials);
  }, [credentials]);
  return (
    <>
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <div className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
            <div className="w-full sm:p-4 px-4 mb-6">
              <h1 className="title-font font-medium text-xl mb-2 text-white">
                Hello{" "}
                {isAuthenticated
                  ? isLoading
                    ? "is Loading"
                    : `${data!.username}`
                  : ""}
              </h1>
              <div className="leading-relaxed">
                Welcome to RXScope Platform!{" "}
                {isAuthenticated
                  ? ""
                  : "Please Login to start using our Tools."}
              </div>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl text-white">
                15.3K
              </h2>
              <p className="leading-relaxed">Drugs</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl text-white">3</h2>
              <p className="leading-relaxed">Users</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl text-white">1</h2>
              <p className="leading-relaxed">Data Sources</p>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
              <h2 className="title-font font-medium text-3xl text-white">1</h2>
              <p className="leading-relaxed">Products</p>
            </div>
          </div>
          <div className="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
            <Image
              className="object-cover object-center w-full h-full"
              src="https://dummyimage.com/600x300"
              alt="stats"
              width={600}
              height={300}
            />
          </div>
        </div>
      </section>
      <section className="text-gray-400 bg-gray-900 body-font relative">
        <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-2/3 md:w-1/2 bg-gray-900 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
            {/* https://www.maps.ie/create-google-map/ */}
            <iframe
              width="100%"
              height="100%"
              title="map"
              className="absolute inset-0"
              style={{
                filter: "grayscale(0) contrast(1) opacity(0.8)",
                border: 0,
                overflow: "hidden",
                margin: 0,
              }}
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=London+(RXScope)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            ></iframe>
            <div className="bg-gray-900 relative flex flex-wrap py-6 rounded shadow-md">
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-white tracking-widest text-xs">
                  EMAIL
                </h2>
                <a className="text-indigo-400 leading-relaxed">
                  l.leung@rxscope.co.uk
                </a>
                <h2 className="title-font font-semibold text-white tracking-widest text-xs mt-4">
                  PHONE
                </h2>
                <p className="leading-relaxed">+447543781301</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 md:w-1/2 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              Demo Request Form
            </h2>
            <p className="leading-relaxed mb-5">
              Please fill in and submit the request form. We would contact you
              if you are eligible for demo.
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
                  localStorage.setItem(
                    "requestForm",
                    JSON.stringify(tmpRequestForm),
                  );
                }}
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-400"
              >
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
                  localStorage.setItem(
                    "requestForm",
                    JSON.stringify(tmpRequestForm),
                  );
                }}
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-400"
              >
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
                  localStorage.setItem(
                    "requestForm",
                    JSON.stringify(tmpRequestForm),
                  );
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
        </div>
      </section>
    </>
  );
}
