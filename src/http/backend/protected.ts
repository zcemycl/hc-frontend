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

export async function fetchFdalabelBySetid(setid: string, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/protected/fdalabel?setid=${setid}`,
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

export async function fetchFdalabelByTradename(
  tradename: string,
  token: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/protected/fdalabel_by_tradename?tradename=${tradename}`,
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

export async function fetchFdalabelByIndication(
  indication: string,
  token: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/protected/fdalabel_by_indication?indication=${indication}`,
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
