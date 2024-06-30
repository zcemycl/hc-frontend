"use server";

export async function fetchFdalabelBySetid(
  setid: string[],
  token: string,
  maxn = 30,
  offset = 0,
  limit = 10,
) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fdalabels/search_by_id`;
  let setids_param = setid.join("&id=");
  const response = await fetch(
    `${API_URI}?id=${setids_param}&maxn=${maxn}&offset=${offset}&limit=${limit}`,
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
  tradename: string[],
  token: string,
  maxn: number = 30,
  offset: number = 0,
  limit: number = 10,
) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fdalabels/search_by_tradename`;
  let tradenames_param = tradename.join("&tradename=");
  console.log(tradenames_param);
  const response = await fetch(
    `${API_URI}?tradename=${tradenames_param}&maxn=${maxn}&offset=${offset}&limit=${limit}`,
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
  sort_by: string = "relevance",
) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fdalabels/search_by_indication`;
  const response = await fetch(
    `${API_URI}?indication=${indication}&maxn=${maxn}&offset=${offset}&limit=${limit}&sort_by=${sort_by}`,
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
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fdalabels/history`;
  const response = await fetch(`${API_URI}/${setid}`, {
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

export async function fetchFdalabelCompareAdverseEffects(
  setids: string[],
  token: string,
) {
  const API_URI = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fdalabels/compare/adverse-effects`;
  const response = await fetch(API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      setids: setids,
    }),
  });
  const res = await response.json();
  return res;
}
