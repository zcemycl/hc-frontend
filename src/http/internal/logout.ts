export async function fetchApiLogout() {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/logout", {
    method: "POST",
    headers,
  });
  return resp;
}
