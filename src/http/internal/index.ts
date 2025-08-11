export async function fetchApiRoot(token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/private", {
    method: "GET",
    headers,
  });
  return resp;
}

export * from "./logout";
export * from "./aws";
export * from "./db";
export * from "./cookie";
