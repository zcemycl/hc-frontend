"use server";
import { fetchFdalabelCountv2 } from "@/http/backend";
import Component from "./component";
import { SampleProvider } from "./context";
import { cookies } from "next/headers";

export default async function SamplePage() {
  const tabName = cookies().get("sample/tabName")?.value ?? "unknown";
  const fdalabelCount = await fetchFdalabelCountv2();

  return (
    <SampleProvider tabName={tabName} count={fdalabelCount.data ?? 0}>
      <Component />
    </SampleProvider>
  );
}
