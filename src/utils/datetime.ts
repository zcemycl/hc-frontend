export function convert_datetime_to_date(datetime: string) {
  return new Date(datetime).toLocaleDateString();
}

export function convert_datetime_to_simple(datetime: string) {
  return new Date(datetime).toLocaleString();
}
