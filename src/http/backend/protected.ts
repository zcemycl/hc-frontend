"use server";

export async function fetchRoot() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = response.json();
  return res;
}

export async function fetchProtected(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/protected`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const res = await response.json();
  return res;
}
