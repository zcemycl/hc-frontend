"use server";

export async function fetchHistoryByUserId(id: number, token: string) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/history/${id}`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await response.json();
  return res;
}

export async function addHistoryByUserId(
  id: number,
  category: string,
  detail: any,
  token: string,
) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/history/${id}`;
  const response = await fetch(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      category,
      detail,
    }),
  });
  return {};
}
