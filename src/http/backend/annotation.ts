"use server";
import { AnnotationCategoryEnum } from "@/types";
import { FASTAPI_URI } from "./constants";

export async function fetchUnannotatedAETableByUserId(
  id: number,
  token: string,
  offset: number = 10,
  limit: number = 10,
  reverse: boolean = false,
  complete: boolean = false,
) {
  const API_URI = `${FASTAPI_URI}/annnotation/${id}/unannotated_ae_tables`;
  const API_URI_PAGINATION = `${API_URI}?offset=${offset}&limit=${limit}&reverse=${reverse}&complete=${complete}`;
  const response = await fetch(API_URI_PAGINATION, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await response.json();
  return res;
}

export async function fetchAETableByIds(
  id: number,
  setid: string,
  token: string,
) {
  const API_URI = `${FASTAPI_URI}/annnotation/fdalabel/${setid}/adverse_effect_table/${id}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "force-cache",
  });
  const res = await response.json();
  return res;
}

export async function fetchAETableBySetid(setid: string, token: string) {
  const API_URI = `${FASTAPI_URI}/annnotation/fdalabel/${setid}/adverse_effect_table`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "force-cache",
  });
  const res = await response.json();
  return res;
}

export async function addAnnotationByNameId(
  id: number,
  name: string,
  annotation: { [key: string]: any },
  token: string,
) {
  const API_URI = `${FASTAPI_URI}/annnotation/fdalabel/${name}/${id}`;
  const response = await fetch(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(annotation),
  });
  return {};
}

export async function fetchAnnotatedTableMapByNameIds(
  id: number,
  name: string,
  token: string,
  is_ai: boolean = false,
) {
  const API_URI = `${FASTAPI_URI}/annnotation/annotated/${name}/${id}?is_ai=${is_ai}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
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
  token: string,
) {
  const API_URI = `${FASTAPI_URI}/annnotation/user/${user_id}/annotated/${tablename}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    const res = await response.json();
    return res;
  } catch (e) {
    return 0;
  }
}
