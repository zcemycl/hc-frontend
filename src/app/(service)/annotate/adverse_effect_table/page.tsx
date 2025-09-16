"use client";
import { ProtectedRoute, PulseTemplate } from "@/components";
import { useAETableAnnotation, useLoader } from "@/contexts";
import AEAnnotateListToolbar from "./ae-annotate-list-toolbar";
import ListAETablesPanel from "./list-ae-tables-panel";

export default function Page() {
  const { refUnannotatedGroup } = useAETableAnnotation();

  return (
    <ProtectedRoute>
      <PulseTemplate refSection={refUnannotatedGroup} overflowY={true}>
        <div className="px-2 py-24 flex flex-col justify-center items-center align-center">
          <AEAnnotateListToolbar />
          <ListAETablesPanel />
        </div>
      </PulseTemplate>
    </ProtectedRoute>
  );
}
