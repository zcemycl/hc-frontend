export function pagination_uri(
  BASE_URL: string,
  offset: number,
  limit: number,
) {
  return `${BASE_URL}&offset=${offset}&limit=${limit}`;
}
