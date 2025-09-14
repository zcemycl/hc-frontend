export function pagination_uri(
  BASE_URL: string,
  offset: number,
  limit: number,
) {
  return `${BASE_URL}&offset=${offset}&limit=${limit}`;
}

export function adjustPageNAfterDelete({
  prevPageN,
  totalBundlesAfterDelete,
  nPerPage,
}: {
  prevPageN: number;
  totalBundlesAfterDelete: number;
  nPerPage: number;
}): number {
  const totalPages = Math.ceil(totalBundlesAfterDelete / nPerPage);

  // If no bundles left, reset to first page
  if (totalBundlesAfterDelete === 0) return 0;

  // Last valid page index
  const lastPage = totalPages - 1;

  // If current page becomes empty after delete, step back
  if (prevPageN > lastPage) {
    return lastPage;
  }

  return prevPageN;
}
