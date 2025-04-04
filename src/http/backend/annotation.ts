"use server";
import { AnnotationCategoryEnum } from "@/types";
import { AETableVerEnum, aeTableVersionMap } from "@/constants";
import { FASTAPI_URI } from "./constants";
import { get_token_cookie, validate_response_ok } from "../utils-server";

export async function fetchUnannotatedAETableByUserId(
  id: number,
  tablename: AnnotationCategoryEnum = AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
  offset: number = 10,
  limit: number = 10,
  reverse: boolean = false,
  complete: boolean = false,
  version: AETableVerEnum = AETableVerEnum.v0_0_1,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/${id}/unannotated_ae_tables/${tablename}`;
  const params = new URLSearchParams();
  params.append("offset", offset.toString());
  params.append("limit", limit.toString());
  params.append("reverse", reverse.toString());
  params.append("complete", complete.toString());
  params.append("version", version);
  const API_URI_PAGINATION = `${API_URI}?${params}`;
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
  tablename: AnnotationCategoryEnum = AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
  reverse: boolean = false,
  complete: boolean = false,
  version: AETableVerEnum = AETableVerEnum.v0_0_1,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/${id}/unannotated_ae_tables_count/${tablename}`;
  const params = new URLSearchParams();
  params.append("reverse", reverse.toString());
  params.append("complete", complete.toString());
  params.append("version", version);
  const API_URI_PAGINATION = `${API_URI}?${params}`;
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

export async function fetchAETableByIds(
  id: number,
  tablename: AnnotationCategoryEnum,
  setid: string,
  version: AETableVerEnum = AETableVerEnum.v0_0_1,
) {
  const token = get_token_cookie();
  const params = new URLSearchParams();
  params.append("version", version);
  const API_URI = `${FASTAPI_URI}/annnotation/fdalabel/${setid}/${tablename}/${id}?${params}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // cache: "force-cache",
  });
  validate_response_ok(response);
  const res = await response.json();
  return res;
}

export async function fetchAETableBySetid(
  setid: string,
  tablename: AnnotationCategoryEnum = AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE,
) {
  const token = get_token_cookie();
  const API_URI = `${FASTAPI_URI}/annnotation/fdalabel/${setid}/${tablename}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // cache: "force-cache",
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
  version: AETableVerEnum = AETableVerEnum.v0_0_1,
) {
  const token = get_token_cookie();
  const params = new URLSearchParams();
  params.append("is_ai", is_ai.toString());
  params.append("version", version);
  const API_URI = `${FASTAPI_URI}/annnotation/annotated/${name}/${id}?${params}`;

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
