import { ProtectedRoute } from "@/components";

export default function Page() {
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]"></section>
    </ProtectedRoute>
  );
}
