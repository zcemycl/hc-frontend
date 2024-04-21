"use server";

export async function fetchRoot() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      referrerPolicy: "unsafe-url",
    },
  });
  return response;
}

export async function fetchProtected(token: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/protected`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      referrerPolicy: "unsafe-url",
    },
  );
  return response;
}
