import { Spinner } from "@/components";

export default function Loading() {
  return (
    <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
      <div
        className="container px-2 py-24 mx-auto grid justify-items-center
      "
      >
        <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10">
          <div
            role="status"
            className="absolute left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2"
          >
            <Spinner />
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </section>
  );
}
