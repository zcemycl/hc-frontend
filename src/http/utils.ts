export function pagination_uri(
  BASE_URL: string,
  offset: number,
  limit: number,
) {
  return `${BASE_URL}&offset=${offset}&limit=${limit}`;
}

export const beautifulNumber = (value: number) => {
  let newvalue, res;
  if (value >= 1000) {
    newvalue = (value / 1000).toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    res = `${newvalue}K`;
  } else {
    newvalue = value;
    res = `${newvalue}`;
  }
  return res;
};
