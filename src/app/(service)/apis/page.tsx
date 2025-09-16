import { ProtectedRoute, PulseTemplate } from "@/components";

export default function APIs() {
  return (
    <ProtectedRoute>
      <PulseTemplate>
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
      </PulseTemplate>
    </ProtectedRoute>
  );
}
