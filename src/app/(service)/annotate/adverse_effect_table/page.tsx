"use client";
import { Spinner, ProtectedRoute } from "@/components";
import {
  useAuth,
  useAETableAnnotation,
  useLoader,
  FdaVersionsProvider,
} from "@/contexts";
import AEAnnotateListToolbar from "./ae-annotate-list-toolbar";
import ListAETablesPanel from "./list-ae-tables-panel";

export default function Page() {
  const { isLoadingAuth } = useAuth();
  const { isLoading } = useLoader();
  const { refUnannotatedGroup } = useAETableAnnotation();

  return (
    <ProtectedRoute>
      <section
        className={`text-gray-400 bg-gray-900 body-font 
        h-[81vh] sm:h-[89vh] overflow-y-scroll
        ${isLoading || isLoadingAuth ? "animate-pulse" : ""}`}
        ref={refUnannotatedGroup}
      >
        <div className="px-2 py-24 flex flex-col justify-center items-center align-center">
          <div
            role="status"
            className={`absolute left-1/2 top-1/2 transition-opacity duration-700
            -translate-x-1/2 -translate-y-1/2 ${isLoading || isLoadingAuth ? "opacity-1" : "opacity-0"}`}
          >
            <Spinner />
            <span className="sr-only">Loading...</span>
          </div>
          <AEAnnotateListToolbar />

          <ListAETablesPanel />
        </div>
      </section>
    </ProtectedRoute>
  );
}
