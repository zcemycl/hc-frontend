"use server";

import { UserRoleEnum } from "@/types";
import { FASTAPI_URI } from "./constants";
import { get_token_cookie, validate_response_ok } from "../utils-server";
import { cookies } from "next/headers";

export async function fetchUserInfoById(id: number) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/users/id/${id}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchUserInfoByName(name: string) {
  const cookie = cookies();
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/users/name/${name}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  const res = await response.json();
  cookie.set("role", res.role);
  cookie.set("userId", res.id);
  return res;
}

export async function fetchUserAll(offset = 0, limit = 10) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/users/?offset=${offset}&limit=${limit}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function deleteUserById(id: number) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/users/${id}`;
  const response = await fetch(API_URI, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  return {};
}

export async function createUserPostgres(
  username: string,
  email: string,
  sub: string,
  enabled: boolean,
  role: UserRoleEnum,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/users/`;
  const response = await fetch(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      email,
      sub,
      enabled,
      role,
    }),
  });
  validate_response_ok(response);
  return {};
}
