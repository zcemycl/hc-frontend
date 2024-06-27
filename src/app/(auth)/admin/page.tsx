"use client";
import { useRef, useState, useEffect } from "react";
import { TypographyH2 } from "@/components/typography";
import { ProtectedRoute, useAuth } from "@/contexts";
import { fetchUserAll } from "@/http/backend/users";
import { IUser } from "@/types/users";
import { useRouter } from "next/navigation";
import PaginationBar from "@/components/pagebar";
import { convert_datetime_to_date } from "@/utils";
import { delete_user } from "@/http/internal/aws/cognito";

export default function Admin() {
  const refUserGroup = useRef(null);
  const router = useRouter();
  const { credentials, setIsAuthenticated } = useAuth();
  const [displayData, setDisplayData] = useState<IUser[]>([]);
  const [pageN, setPageN] = useState(0);
  const [nPerPage, _] = useState(10);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev") {
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        router.push("/logout");
      }
    }
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      const resp = await fetchUserAll(
        credJson.AccessToken,
        pageN * nPerPage,
        nPerPage,
      );
      setDisplayData(resp);
    }
    getData(credentials);
  }, []);

  return (
    <ProtectedRoute>
      <section
        className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh] overflow-y-scroll"
        ref={refUserGroup}
      >
        <div className="container px-2 py-24 mx-auto grid justify-items-center">
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-10 pt-10 pb-5">
            <div className="flex justify-between">
              <TypographyH2>Admin Panel</TypographyH2>
              <button
                className="w-[1rem] h-1/2 p-1 leading-[0px] m-0
            bg-green-300 rounded-full text-black hover:bg-green-500"
                onClick={() => {
                  console.log("adding user");
                }}
              >
                +
              </button>
            </div>
          </div>
          {displayData.length > 0 && (
            <>
              {displayData.map((each, idx) => {
                return (
                  <div
                    className="sm:w-1/2 flex flex-col w-screen px-10 py-5"
                    key={each.id}
                  >
                    <div className="flex justify-between">
                      <TypographyH2>
                        {each.username} [{each.role}]
                      </TypographyH2>
                      <button
                        className="w-[1rem] h-[1rem] p-0 leading-[0px] m-0
                        bg-red-600 rounded-full text-white hover:bg-red-700"
                        onClick={async () => {
                          const credJson = JSON.parse(credentials);
                          console.log("deleting user");
                          await delete_user("fhaha", credJson.AccessToken);
                        }}
                      >
                        x
                      </button>
                    </div>

                    <TypographyH2>Email Address: {each.email}</TypographyH2>
                    <TypographyH2>
                      Creation Date:{" "}
                      {convert_datetime_to_date(each.created_date)}
                    </TypographyH2>
                    <hr />
                  </div>
                );
              })}
              <div className="flex justify-center space-x-1">
                <PaginationBar
                  topN={displayData.length}
                  pageN={pageN}
                  nPerPage={nPerPage}
                  setPageN={(i: number) => {
                    setPageN(i);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
