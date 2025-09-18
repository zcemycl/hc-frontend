"use client";
import { useSearchParams } from "next/navigation";
import { PageProps } from "./props";
import { useEffect } from "react";
import { ListPageTemplate, ProfileBar, ProtectedRoute } from "@/components";
import { useLoader } from "@/contexts";

export default function Page({ params }: Readonly<PageProps>) {
  const searchParams = useSearchParams();
  const { isLoadingv2, withLoading } = useLoader();

  useEffect(() => {
    console.log(searchParams);
  }, []);
  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <ProfileBar title={"Add Annotation to Bundle"} />
        <hr className="mb-2" />
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
