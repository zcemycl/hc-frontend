"use client";
import { useRef, useState, useEffect } from "react";
import { TypographyH2 } from "@/components/typography";
import { ProtectedRoute, useAuth } from "@/contexts";
import { fetchUserAll } from "@/http/backend/users";
import { IUser } from "@/types/users";
import { useRouter } from "next/navigation";
import PaginationBar from "@/components/pagebar";
import { convert_datetime_to_date } from "@/utils";
import { create_user, delete_user } from "@/http/internal/aws/cognito";
import Modal from "@/components/modal";

interface IAddUserInfo {
  username?: string;
  email?: string;
}

export default function Admin() {
  const refUserGroup = useRef(null);
  const router = useRouter();
  const { credentials, setIsAuthenticated } = useAuth();
  const [isOpenAddUserModal, setIsOpenAddUserModal] = useState(false);
  const [isOpenDelUserModal, setIsOpenDelUserModal] = useState(false);
  const [addUserInfo, setAddUserInfo] = useState<IAddUserInfo>({});
  const [displayData, setDisplayData] = useState<IUser[]>([]);
  const [delUserIndex, setDelUserIndex] = useState<number>(0);
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
          <Modal
            title={`Confirm Delete User -- ${displayData[delUserIndex]?.email} ?`}
            isOpenModal={isOpenDelUserModal}
            setIsOpenModal={setIsOpenDelUserModal}
          >
            <div className="content-center justify-center flex py-2">
              <button
                className="
              px-10 py-5
              rounded-lg bg-red-700 hover:bg-red-900 
              text-white"
                onClick={async () => {
                  const credJson = JSON.parse(credentials);
                  await delete_user(
                    displayData[delUserIndex].username,
                    displayData[delUserIndex].email,
                    credJson.AccessToken,
                  );
                  setIsOpenDelUserModal(false);
                  setDelUserIndex(0);
                }}
              >
                YES
              </button>
            </div>
          </Modal>
          <Modal
            title={`Enter New User Information`}
            isOpenModal={isOpenAddUserModal}
            setIsOpenModal={setIsOpenAddUserModal}
          >
            <div className="flex flex-col space-y-2 px-10 py-5">
              <div>
                <label htmlFor="">Username</label>
                <input
                  type="text"
                  className="bg-white w-full"
                  onChange={(e) => {
                    setAddUserInfo({
                      ...addUserInfo,
                      username: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div>
                <label htmlFor="">Email Address</label>
                <input
                  type="text"
                  className="bg-white w-full"
                  onChange={(e) => {
                    setAddUserInfo({
                      ...addUserInfo,
                      email: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div>
                <button
                  className="text-black bg-green-200 hover:bg-green-400 
                    p-6 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </Modal>
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen px-10 pt-10 pb-5">
            <div className="flex justify-between">
              <TypographyH2>Admin Panel</TypographyH2>
              <button
                className="w-[1rem] h-1/2 p-1 leading-[0px] m-0
            bg-green-300 rounded-full text-black hover:bg-green-500"
                onClick={async () => {
                  const credJson = JSON.parse(credentials);
                  console.log("adding user");
                  setIsOpenAddUserModal(true);

                  // const resp = await create_user(
                  //   "leo.leung.faculty",
                  //   "leo.leung@faculty.ai",
                  //   credJson.AccessToken,
                  // );
                  // console.log(resp);
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
                          console.log("deleting user");
                          setIsOpenDelUserModal(true);
                          setDelUserIndex(idx);
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
