"use client";
import { useSearchParams } from "next/navigation";
import { PageProps } from "./props";
import { useEffect } from "react";
import { ListPageTemplate, ProfileBar, ProtectedRoute } from "@/components";

export default function Page({ params }: Readonly<PageProps>) {
  const searchParams = useSearchParams();
  useEffect(() => {
    console.log(searchParams);
  }, []);
  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <ProfileBar title={"Add Annotation to Bundle"} />
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
