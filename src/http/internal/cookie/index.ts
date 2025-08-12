export async function setFdalabelCount(count: number) {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/fdalabel_count", {
    method: "POST",
    headers,
    body: JSON.stringify({
      count,
    }),
  });
  return resp;
}

export async function setUserCount(count: number) {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch("/api/user_count", {
    method: "POST",
    headers,
    body: JSON.stringify({
      count,
    }),
  });
  return resp;
}
