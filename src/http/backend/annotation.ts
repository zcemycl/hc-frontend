"use server";

export async function fetchUnannotatedAETableByUserId(
  id: number,
  token: string,
  offset: number = 10,
  limit: number = 10,
) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/annnotation/${id}/unannotated_ae_tables`;
  const API_URI_PAGINATION = `${API_URI}?offset=${offset}&limit=${limit}`;
  const response = await fetch(API_URI_PAGINATION, {
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
