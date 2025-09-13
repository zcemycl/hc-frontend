"use client";
import { useSearchParams } from "next/navigation";
import { PageProps } from "./props";
import { useEffect } from "react";

export default function Page({ params }: Readonly<PageProps>) {
  const searchParams = useSearchParams();
  useEffect(() => {
    console.log(searchParams);
  }, []);
  return <></>;
}
