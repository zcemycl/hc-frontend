import { ProtectedRoute } from "@/components";

export default function APIs() {
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[81vh] sm:h-[89vh]">
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
    "
        >
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10">
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              APIs
            </h2>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
