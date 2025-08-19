/**
 * @deprecated Use `validateToken` instead.
 */
export async function fetchApiRoot(token: string): Promise<Response> {
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
