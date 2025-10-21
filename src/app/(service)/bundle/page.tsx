"use client";
import { ListPageTemplate, ProfileBar, ProtectedRoute } from "@/components";
import { useLoader } from "@/contexts";
import { useApiHandler } from "@/hooks";
import { fetchBundleByIdv2 } from "@/http/backend";
import { IAnnotationRef, IBundle, IFdaLabelRef, IUserRef } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const bundle_id = searchParams.get("id");
  const [bundle, setBundle] = useState<IBundle | null>(null);
  const { withLoading } = useLoader();
  const { handleResponse } = useApiHandler();

  useEffect(() => {
    const getData = async () => {
      const resBundle = await withLoading(() =>
        fetchBundleByIdv2(bundle_id as string),
      );
      console.log(resBundle);
      if (!resBundle.success) handleResponse(resBundle);
      setBundle(resBundle.data || null);
    };
    getData();
  }, [bundle_id]);

  const useFor = useMemo<string>(() => {
    if (bundle === null) return "Not In Use";
    let useFor: string = "Not In Use";
    if (bundle.annotations.length === 0 && bundle.fdalabels.length === 0) {
      useFor = "Not In Use";
    } else if (bundle.annotations.length === 0 && bundle.fdalabels.length > 0) {
      useFor = "Fdalabel";
    } else if (bundle.annotations.length > 0 && bundle.fdalabels.length === 0) {
      useFor = "Annotation";
    }
    return useFor;
  }, [bundle]);

  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <ProfileBar title={`Bundle ${bundle?.name || ""}`} />
        <hr className="mb-2" />
        <div id="basic-bundle-content" className="flex flex-col space-y-2">
          <div
            className="flex flex-row justify-start space-x-2
            select-text"
          >
            <span>Reference: </span>
            <span
              className="bg-amber-300 rounded-lg px-3 
            text-black flex-shrink-0 whitespace-nowrap
            font-semibold"
            >
              {bundle?.id}
            </span>
          </div>
          <div className="flex flex-row justify-start space-x-2">
            <span>Category: </span>
            <span
              className="bg-amber-300 rounded-lg px-3 
            text-black flex-shrink-0 whitespace-nowrap
            font-semibold"
            >
              {useFor}
            </span>
          </div>
          {bundle?.description !== "" && (
            <div className="flex flex-row justify-start space-x-2">
              Description: {bundle?.description}
            </div>
          )}
          {bundle?.users.length !== 0 && (
            <div
              className="flex flex-row justify-start space-x-2
                flex-wrap"
            >
              <span>Owners: </span>
              {bundle?.users.map((u: IUserRef) => (
                <span
                  className="px-2 bg-emerald-400 
                        rounded-lg font-semibold text-black"
                  key={`bundle-user-${u.email}`}
                >
                  {u.email}
                </span>
              ))}
            </div>
          )}
          {bundle?.fdalabels.length !== 0 && (
            <div
              className="flex flex-row justify-start gap-2
                flex-wrap"
            >
              <span>Drugs: </span>
              {bundle?.fdalabels.map((f: IFdaLabelRef) => (
                <span
                  className="px-2 bg-emerald-400 
                        rounded-lg font-semibold text-black"
                  key={`bundle-drug-${f.setid}`}
                >
                  {f.tradename}
                </span>
              ))}
            </div>
          )}
          {bundle?.annotations.length !== 0 && (
            <div
              className="flex flex-row justify-start gap-2
                flex-wrap"
            >
              <span>Annotations: </span>
              {bundle?.annotations.map((ann: IAnnotationRef) => (
                <span
                  className="px-2 bg-emerald-400 
                        rounded-lg font-semibold text-black"
                  key={`bundle-annotation-${ann.id}`}
                >
                  {ann.category} - {ann.table_id} - {ann.id}
                </span>
              ))}
            </div>
          )}
        </div>
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
