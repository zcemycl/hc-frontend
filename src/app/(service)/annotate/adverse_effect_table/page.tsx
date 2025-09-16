"use client";
import { ProtectedRoute } from "@/components";
import { useAETableAnnotation, useLoader } from "@/contexts";
import AEAnnotateListToolbar from "./ae-annotate-list-toolbar";
import ListAETablesPanel from "./list-ae-tables-panel";

export default function Page() {
  const { isLoadingv2 } = useLoader();
  const { refUnannotatedGroup } = useAETableAnnotation();

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
        h-[81vh] sm:h-[89vh] overflow-y-scroll
        ${isLoadingv2 ? "animate-pulse" : ""}`}
        ref={refUnannotatedGroup}
      >
        <div className="px-2 py-24 flex flex-col justify-center items-center align-center">
          <AEAnnotateListToolbar />
          <ListAETablesPanel />
        </div>
      </section>
    </ProtectedRoute>
  );
}
