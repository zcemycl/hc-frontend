"use client";
import { useSearchParams } from "next/navigation";
import { PageProps } from "./props";
import { useEffect } from "react";
import { ProtectedRoute, PulseTemplate } from "@/components";

export default function Page({ params }: Readonly<PageProps>) {
  const searchParams = useSearchParams();
  useEffect(() => {
    console.log(searchParams);
  }, []);
  return (
    <ProtectedRoute>
      <PulseTemplate overflowY={true}>
        <></>
      </PulseTemplate>
    </ProtectedRoute>
  );
}
