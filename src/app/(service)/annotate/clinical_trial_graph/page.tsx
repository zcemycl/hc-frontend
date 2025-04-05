"use client";
import { ProtectedRoute } from "@/components";
import { ReactFlowProvider } from "@xyflow/react";
import Component from "./component";

import "@xyflow/react/dist/style.css";

export default function Page() {
  return (
    <ProtectedRoute>
      <ReactFlowProvider>
        <Component />
      </ReactFlowProvider>
    </ProtectedRoute>
  );
}
