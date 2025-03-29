export async function check_pg_health() {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch(`/api/pg_healthcheck`, {
    method: "GET",
    headers,
  });

  return await resp.json();
}

export async function check_neo4j_health() {
  const headers = {
    "Content-Type": "application/json",
  };
  const resp = await fetch(`/api/neo4j_healthcheck`, {
    method: "GET",
    headers,
  });

  return await resp.json();
}
