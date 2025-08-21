"use server";

import { LocalGenericProvider } from "@/contexts";
import Search from "./component";

export default async function Page() {
  return (
    <LocalGenericProvider initialData={{}}>
      <Search />
    </LocalGenericProvider>
  );
}
