"use server";

export async function fetchUserInfoById(id: number, token: string) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/id/${id}`;
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

export async function fetchUserInfoByName(name: string, token: string) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/name/${name}`;
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

export async function fetchUserAll(token: string, offset = 0, limit = 10) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/?offset=${offset}&limit=${limit}`;
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
