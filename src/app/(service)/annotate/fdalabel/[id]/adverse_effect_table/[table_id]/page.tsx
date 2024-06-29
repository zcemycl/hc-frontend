import { ProtectedRoute, useAuth } from "@/contexts";

interface PageProps {
  params: {
    id: number;
    table_id: number;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
        "
        >
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              Annotation
            </h2>
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              Set ID: {params.id}
            </h2>
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              Table: {params.table_id}
            </h2>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
