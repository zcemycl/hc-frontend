"use client";
import { TypographyH2 } from "@/components";
import { ProtectedRoute, useAuth } from "@/contexts";
import { useRouter } from "next/navigation";

export default function Annotate() {
  const router = useRouter();
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
    "
        >
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
            <TypographyH2>Annotation</TypographyH2>
            <p className="leading-relaxed mb-5">
              Our aim is to build robust and reliable AI models to digest drug
              data. We would need domain knowledge from world class expertise to
              help training our AI.
            </p>
            <p className="leading-relaxed mb-5">
              We value your help to accelerating our model training and
              evaluation.
            </p>
            <TypographyH2>Tasks</TypographyH2>
            <div className="flex flex-col space-y-4">
              <button
                className="text-white 
                bg-indigo-500 hover:bg-indigo-600
                border-0 py-3 px-6 rounded text-left
                focus:outline-none text-xl w-full"
                onClick={() => {
                  router.push("/annotate/adverse_effect_table");
                }}
              >
                Adverse Effects Table
              </button>
              <button
                // disabled={true}
                className={`text-white 
                ${true ? "bg-indigo-500 hover:bg-indigo-600" : "bg-slate-500"}
                border-0 py-3 px-6 rounded text-left
                focus:outline-none text-xl w-full`}
                onClick={() => {
                  router.push("/annotate/clinical_trial_table");
                }}
              >
                Clinical Trials Table
              </button>
              <button
                disabled={true}
                className={`text-white 
                ${false ? "bg-indigo-500 hover:bg-indigo-600" : "bg-slate-500"}
                border-0 py-3 px-6 rounded text-left
                focus:outline-none text-xl w-full`}
              >
                Dosage Form
              </button>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
