import { ProtectedRoute } from "@/contexts";

export default function Admin() {
  return (
    <ProtectedRoute>
      <>Admin Console</>
    </ProtectedRoute>
  );
}
