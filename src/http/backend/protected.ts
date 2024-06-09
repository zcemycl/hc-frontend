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

export async function fetchFdalabelBySetid(
  setid: string,
  token: string,
  maxn = 30,
  offset = 0,
  limit = 10,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/protected/fdalabel?setid=${setid}&maxn=${maxn}&offset=${offset}&limit=${limit}`,
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
  maxn: number = 30,
  offset: number = 0,
  limit: number = 10,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/protected/fdalabel_by_tradename?tradename=${tradename}&maxn=${maxn}&offset=${offset}&limit=${limit}`,
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
  maxn: number = 30,
  offset: number = 0,
  limit: number = 10,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/protected/fdalabel_by_indication?indication=${indication}&maxn=${maxn}&offset=${offset}&limit=${limit}`,
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

export async function fetchFdalabelHistoryBySetid(
  setid: string,
  token: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fdalabel/history/${setid}`,
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

export async function fetchFdalabelCompareAdverseEffects(
  setids: string[],
  token: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fdalabel/compare/adverse-effects/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        setids: setids,
      }),
    },
  );
  const res = await response.json();
  return res;
}
