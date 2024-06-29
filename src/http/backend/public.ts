"use server";

export async function fetchFdalabelCount() {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/get_fdalabel_count`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });
  const res = await response.json();
  return res;
}

export async function fetchUserCount() {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/get_user_count`;
  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  });
  const res = await response.json();
  return res;
}
