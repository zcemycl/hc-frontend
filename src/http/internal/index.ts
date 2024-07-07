export async function fetchApiRoot(id: number, token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const resp = await fetch(`/api/private/?id=${id}`, {
    method: "GET",
    headers,
  });
  return resp;
}

export * from "./aws";
