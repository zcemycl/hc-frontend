export function convert_datetime_to_date(datetime: string) {
  return new Date(datetime).toLocaleDateString();
}
