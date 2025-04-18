"use client";
import { TypographyH2, ProtectedRoute } from "@/components";
import { AnnotatePageNameLinkPairs } from "@/constants";
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
          <div
            className="
            sm:w-11/12 md:w-7/12 w-full
            p-1 sm:p-10
            flex flex-col mt-8 space-y-2"
          >
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
              {AnnotatePageNameLinkPairs.map((v) => {
                return (
                  <button
                    key={`link-${v.href}`}
                    className={`text-white
                  ${v.disabled ? "bg-slate-500" : "bg-indigo-500 hover:bg-indigo-600"}
                  border-0 py-3 px-6 rounded text-left
                  focus:outline-none text-xl w-full`}
                    disabled={v.disabled}
                    onClick={() => {
                      router.push(v.href);
                    }}
                  >
                    {v.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
