"use server";
import { fetchFdalabelCount } from "@/http/backend";
import Component from "./component";
import { SampleProvider } from "./context";
import { cookies } from "next/headers";

export default async function SamplePage() {
  const tabName = cookies().get("sample/tabName")?.value ?? "unknown";
  const fdalabelCount = await fetchFdalabelCount();

  return (
    <SampleProvider tabName={tabName} count={fdalabelCount}>
      <Component />
    </SampleProvider>
  );
}
