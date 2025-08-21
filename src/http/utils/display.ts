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
