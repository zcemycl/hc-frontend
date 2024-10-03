"use server";
import { AnnotationCategoryEnum } from "@/types";
import { FASTAPI_URI } from "./constants";
import { get_token_cookie, validate_response_ok } from "../utils-server";

export async function fetchUnannotatedAETableByUserId(
  id: number,
  offset: number = 10,
  limit: number = 10,
  reverse: boolean = false,
  complete: boolean = false,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/${id}/unannotated_ae_tables`;
  const API_URI_PAGINATION = `${API_URI}?offset=${offset}&limit=${limit}&reverse=${reverse}&complete=${complete}`;
  const response = await fetch(API_URI_PAGINATION, {
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

export async function fetchUnannotatedAETableByUserIdCount(
  id: number,
  reverse: boolean = false,
  complete: boolean = false,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/${id}/unannotated_ae_tables_count`;
  const API_URI_PAGINATION = `${API_URI}?reverse=${reverse}&complete=${complete}`;
  const response = await fetch(API_URI_PAGINATION, {
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

export async function fetchAETableByIds(id: number, setid: string) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/fdalabel/${setid}/adverse_effect_table/${id}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "force-cache",
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchAETableBySetid(setid: string) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/fdalabel/${setid}/adverse_effect_table`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "force-cache",
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function addAnnotationByNameId(
  id: number,
  name: string,
  annotation: { [key: string]: any },
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/fdalabel/${name}/${id}`;
  const response = await fetch(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(annotation),
  });
  validate_response_ok(response);
  return {};
}

export async function fetchAnnotatedTableMapByNameIds(
  id: number,
  name: string,
  is_ai: boolean = false,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/annotated/${name}/${id}?is_ai=${is_ai}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  try {
    const res = await response.json();
    return res;
  } catch (e) {
    return { annotated: {} };
  }
}

export async function fetchAnnotatedCountByUserId(
  user_id: number,
  tablename: AnnotationCategoryEnum,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/user/${user_id}/annotated/${tablename}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  validate_response_ok(response);
  try {
    const res = await response.json();
    return res;
  } catch (e) {
    return 0;
  }
}
