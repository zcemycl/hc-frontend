"use client";
import { useRef, useState, useEffect, useId, useCallback } from "react";
import { useAuth, useLoader } from "@/contexts";
import {
  fetchUserAllv2,
  createUserPostgres,
  deleteUserById,
  fetchUserCount,
} from "@/http/backend";
import { IAddUserInfo, IUser, UserRoleEnum } from "@/types";
import { useRouter } from "next/navigation";
import {
  PaginationBar,
  Modal,
  DropDownBtn,
  DropDownList,
  TypographyH2,
  ProtectedRoute,
  BackBtn,
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
import { PLUS_ICON_URI, X_ICON_URI } from "@/icons/bootstrap";
import { useApiHandler } from "@/hooks";

export default function Admin() {
  const id = useId();
  const { handleResponse } = useApiHandler();
  const refUserGroup = useRef(null);
  const router = useRouter();
  const { credentials, setIsAuthenticated, isLoadingAuth } = useAuth();
  const { isLoadingv2, withLoading } = useLoader();
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
  const [topN, setTopN] = useState(0);
  const [nPerPage, _] = useState(10);

  const fetchUsersCallback = useCallback(async () => {
    const resp = await withLoading(() =>
      fetchUserAllv2(pageN * nPerPage, nPerPage),
    );
    handleResponse(resp);
    setDisplayData(resp.data ?? []);
  }, [pageN, nPerPage]);

  useEffect(() => {
    withLoading(() => fetchUserCount()).then((x: number) => setTopN(x));
  }, []);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (credentials.length === 0) {
      setIsAuthenticated(false);
      router.push(
        process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/logout" : "/",
      );
    }
    async function getData() {
      await fetchUsersCallback();
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageN, isLoadingAuth]);

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font h-[81vh] 
          sm:h-[89vh] overflow-y-scroll
          ${isLoadingv2 ? "animate-pulse" : ""}
          `}
        ref={refUserGroup}
      >
        <div
          className="flex flex-col mt-[7rem] 
          content-center items-center space-y-3"
        >
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
                onClick={async (e) => {
                  e.preventDefault();
                  await withLoading(() =>
                    delete_user(
                      displayData[delUserIndex].username,
                      displayData[delUserIndex].email,
                    ),
                  );
                  await withLoading(() =>
                    deleteUserById(displayData[delUserIndex].id),
                  );
                  setIsOpenDelUserModal(false);
                  setDelUserIndex(0);
                  await fetchUsersCallback();
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
            <div
              className="flex flex-col space-y-2 
              px-2 sm:px-10 
              py-2 sm:py-5"
            >
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
                    const res = await withLoading(() =>
                      create_user(addUserInfo.username, addUserInfo.email),
                    );
                    console.log(res);
                    const sub = res.Attributes.filter(
                      (each: { Name: string }) => each.Name === "sub",
                    )[0].Value;
                    const final_res = await withLoading(() =>
                      createUserPostgres(
                        addUserInfo.username,
                        addUserInfo.email,
                        sub,
                        res.Enabled,
                        addUserInfo.role,
                      ),
                    );
                    console.log(final_res);
                    setIsOpenAddUserModal(false);
                    await fetchUsersCallback();
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </Modal>
          <div
            className="flex flex-col
            sm:w-7/12 w-11/12"
          >
            <div className="flex justify-between align-middle">
              <div className="flex flex-row justify-start space-x-2">
                <TypographyH2>Admin Panel</TypographyH2>
                <BackBtn />
              </div>

              <button
                className="leading-[0px] m-0
                text-black"
                onClick={async (e) => {
                  e.preventDefault();
                  console.log("adding user");
                  setIsOpenAddUserModal(true);
                }}
              >
                <img
                  src={PLUS_ICON_URI}
                  className="w-5 h-5 rounded-full 
                  hover:bg-green-500 bg-green-300"
                />
              </button>
            </div>
          </div>
          {displayData.length > 0 && (
            <>
              {displayData.map((each, idx) => {
                return (
                  <div
                    className="flex flex-col 
                    w-11/12 sm:w-7/12
                    py-1 space-y-2"
                    key={`${id}-user-profile-${each.id}`}
                  >
                    <div className="flex justify-between">
                      <div
                        className="flex justify-between
                        sm:flex-row sm:space-x-1 sm:space-y-0
                        flex-col space-x-0 space-y-1"
                      >
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
                          className="leading-[0px]
                         rounded-full text-white "
                          onClick={async () => {
                            console.log("deleting user");
                            setIsOpenDelUserModal(true);
                            setDelUserIndex(idx);
                          }}
                        >
                          <img
                            src={X_ICON_URI}
                            className="
                            w-5 h-5
                            bg-red-600 hover:bg-red-700
                            rounded-full
                            "
                          />
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
                  topN={topN}
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
