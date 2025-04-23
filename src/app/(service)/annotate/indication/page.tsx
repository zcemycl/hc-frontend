"use client";
import { useEffect, useState } from "react";
import { BackBtn, ProtectedRoute, TypographyH2 } from "@/components";
import { useRouter } from "next/navigation";
import Highlighter from "react-highlight-words";
import { SelectedWordsContext } from "@/contexts";
import { PhraseBubble } from "./phrase-bubble";

const testText = `Divalproex sodium extended-release tablet, USP is an anti-epileptic drug indicated for:
Acute treatment of manic or mixed episodes associated with bipolar disorder, with or without psychotic features (1.1)
Monotherapy and adjunctive therapy of complex partial seizures and simple and complex absence seizures; adjunctive therapy in patients with multiple seizure types that include absence seizures (1.2)
Prophylaxis of migraine headaches (1.3) Divalproex sodium extended-release tablet, USP is an anti-epileptic drug indicated for:
Acute treatment of manic or mixed episodes associated with bipolar disorder, with or without psychotic features (1.1)
Monotherapy and adjunctive therapy of complex partial seizures and simple and complex absence seizures; adjunctive therapy in patients with multiple seizure types that include absence seizures (1.2)
Prophylaxis of migraine headaches (1.3) Divalproex sodium extended-release tablet, USP is an anti-epileptic drug indicated for:
Acute treatment of manic or mixed episodes associated with bipolar disorder, with or without psychotic features (1.1)
Monotherapy and adjunctive therapy of complex partial seizures and simple and complex absence seizures; adjunctive therapy in patients with multiple seizure types that include absence seizures (1.2)
Prophylaxis of migraine headaches (1.3)`;

export default function Page() {
  const router = useRouter();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log(selectedWords);
  }, [selectedWords]);
  return (
    <ProtectedRoute>
      <SelectedWordsContext.Provider
        value={{
          selectedWords,
          setSelectedWords,
          hoveredIndex,
          setHoveredIndex,
        }}
      >
        <section className="text-gray-400 bg-gray-900 body-font h-[81vh] sm:h-[89vh]">
          <div className="px-2 py-24 flex flex-col justify-center items-center align-center">
            <div
              className="sm:w-10/12 flex flex-col mt-8 
            w-full px-1 pt-5 pb-5 space-y-2 max-h-[70vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <div className="flex justify-between items-center space-x-1">
                  <TypographyH2>Indication Annotations</TypographyH2>
                </div>
                <BackBtn />
              </div>
              <div className="flex flex-col sm:flex-row">
                <div
                  className="flex basis-8/12 leading-loose"
                  onMouseUp={(e) => {
                    e.preventDefault();
                    const selection = window.getSelection();
                    const selectedText = selection?.toString().trim();
                    if (
                      !selectedWords.includes(selectedText as string) &&
                      selectedText !== ""
                    ) {
                      setSelectedWords([
                        ...selectedWords,
                        selectedText as string,
                      ]);
                    }
                  }}
                >
                  <Highlighter
                    highlightClassName="bg-red-400 rounded-sm px-2 py-1"
                    searchWords={selectedWords}
                    autoEscape={true}
                    textToHighlight={testText}
                  />
                </div>
                <div
                  className="flex flex-col 
                    bg-sky-800 rounded-lg sm:h-[60vh]
                    basis-1/3
                    space-y-2
                    overflow-y-auto p-4"
                >
                  <h3 className="font-bold text-slate-300">Phrase</h3>
                  <div className="flex flex-wrap gap-2 content-start">
                    {selectedWords.length > 0 ? (
                      selectedWords.map((word, index) => {
                        const isHovered = hoveredIndex === index;
                        return (
                          <PhraseBubble
                            key={index}
                            {...{ word, index, isHovered }}
                          />
                        );
                      })
                    ) : (
                      <span
                        className="font-bold bg-amber-500 
                    text-black rounded-lg p-2"
                      >
                        No phrases selected...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes scrollText {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-100% + 100px));
              }
            }
          `}</style>
        </section>
      </SelectedWordsContext.Provider>
    </ProtectedRoute>
  );
}
