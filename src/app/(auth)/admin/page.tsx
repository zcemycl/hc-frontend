"use client";
import { useRef, useState, useEffect, useId } from "react";
import { ProtectedRoute, useAuth } from "@/contexts";
import {
  fetchUserAll,
  createUserPostgres,
  deleteUserById,
} from "@/http/backend";
import { IUser, UserRoleEnum } from "@/types";
import { useRouter } from "next/navigation";
import {
  PaginationBar,
  Modal,
  DropDownBtn,
  DropDownList,
  TypographyH2,
} from "@/components";
import { convert_datetime_to_date } from "@/utils";
import { create_user, delete_user } from "@/http/internal";
import {
  EXCLUDE_EMAIL_DELETE,
  EXCLUDE_EMAIL_PATCH,
  userRoleMap,
} from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

interface IAddUserInfo {
  username: string;
  email: string;
  role: UserRoleEnum;
}

export default function Admin() {
  const id = useId();
  const refUserGroup = useRef(null);
  const router = useRouter();
  const { credentials, setIsAuthenticated } = useAuth();
  const [isOpenAddUserModal, setIsOpenAddUserModal] = useState(false);
  const [isOpenDelUserModal, setIsOpenDelUserModal] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [addUserInfo, setAddUserInfo] = useState<IAddUserInfo>({
    username: "",
    email: "",
    role: UserRoleEnum.USER,
  });
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
    } else {
      if (credentials.length === 0) {
        setIsAuthenticated(false);
        router.push("/");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageN]);

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
                  await deleteUserById(
                    displayData[delUserIndex].id,
                    credJson.AccessToken,
                  );
                  setIsOpenDelUserModal(false);
                  setDelUserIndex(0);
                  const resp = await fetchUserAll(
                    credJson.AccessToken,
                    pageN * nPerPage,
                    nPerPage,
                  );
                  setDisplayData(resp);
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
                  defaultValue={addUserInfo.username}
                  onChange={(e) => {
                    e.preventDefault();
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
                  defaultValue={addUserInfo.email}
                  onChange={(e) => {
                    e.preventDefault();
                    setAddUserInfo({
                      ...addUserInfo,
                      email: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-row justify-end space-x-1">
                <div>
                  <DropDownBtn
                    extraClassName="justify-end w-full
                      bg-blue-500 hover:bg-blue-700
                      text-black"
                    onClick={() => {
                      setIsRoleDropdownOpen(!isRoleDropdownOpen);
                    }}
                  >
                    Role:{" "}
                    {
                      userRoleMap.filter(
                        (each) => each.roleDisplayName === addUserInfo.role,
                      )[0].roleDisplayName
                    }
                  </DropDownBtn>
                  <div className="flex w-full justify-end h-0">
                    <DropDownList
                      selected={addUserInfo.role}
                      displayNameKey="roleDisplayName"
                      selectionKey="roleDisplayName"
                      allOptions={userRoleMap}
                      isOpen={isRoleDropdownOpen}
                      setSelectionKey={(s: UserRoleEnum) => {
                        setAddUserInfo({
                          ...addUserInfo,
                          role: s as UserRoleEnum,
                        });
                      }}
                      resetCallback={() => {
                        setIsRoleDropdownOpen(false);
                        // setAddUserInfo((prev) => ({...prev, role: UserRoleEnum.USER}))
                      }}
                    />
                  </div>
                </div>
                <button
                  className="text-black bg-green-200 hover:bg-green-400 
                    px-6 py-3 rounded-lg"
                  onClick={async (e) => {
                    e.preventDefault();
                    const credJson = JSON.parse(credentials);
                    const res = await create_user(
                      addUserInfo.username,
                      addUserInfo.email,
                      credJson.AccessToken,
                    );
                    console.log(res);
                    const sub = res.Attributes.filter(
                      (each: { Name: string }) => each.Name === "sub",
                    )[0].Value;
                    const final_res = await createUserPostgres(
                      addUserInfo.username,
                      addUserInfo.email,
                      sub,
                      res.Enabled,
                      addUserInfo.role,
                      credJson.AccessToken,
                    );
                    console.log(final_res);
                    setIsOpenAddUserModal(false);
                    const resp = await fetchUserAll(
                      credJson.AccessToken,
                      pageN * nPerPage,
                      nPerPage,
                    );
                    setDisplayData(resp);
                  }}
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
                  console.log("adding user");
                  setIsOpenAddUserModal(true);
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
                    className="sm:w-1/2 flex flex-col w-screen px-10 py-1 space-y-2"
                    key={`${id}-user-profile-${each.id}`}
                  >
                    <div className="flex justify-between">
                      <div className="flex justify-between space-x-1">
                        <p className="leading-relaxed flex justify-between space-x-1">
                          <span className="bg-blue-400 rounded-sm text-black px-1">
                            {each.username}
                          </span>
                          <span
                            className={`${each.role === UserRoleEnum.ADMIN ? "bg-red-400" : "bg-sky-300"} rounded-sm text-black px-1`}
                          >
                            {each.role}
                          </span>
                        </p>
                        <div className="flex flex-row space-x-1 justify-between">
                          <p>
                            <FontAwesomeIcon size="sm" icon={faChartLine} />
                          </p>
                          <p>{each.activities_count}</p>
                          <span className="bg-transparent rounded-sm px-1 border-x border-cyan-200 space-x-1">
                            <FontAwesomeIcon size="sm" icon={faPenToSquare} />
                            <span>AE</span>
                            <span>{each.ae_annotations_count}</span>
                          </span>
                        </div>
                      </div>

                      {!EXCLUDE_EMAIL_DELETE.includes(each.email) && (
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
                      )}
                    </div>

                    <p
                      className="text-xs text-left text-clip
                          whitespace-nowrap"
                    >
                      Email Address: {each.email}
                    </p>
                    <p
                      className="text-xs text-left text-clip
                          whitespace-nowrap"
                    >
                      Creation Date:{" "}
                      {convert_datetime_to_date(each.created_date)}
                    </p>
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
