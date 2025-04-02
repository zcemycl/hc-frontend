"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute, TypographyH2 } from "@/components";
import { useRouter } from "next/navigation";
import Highlighter from "react-highlight-words";

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
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div className="px-2 py-24 flex flex-col justify-center items-center align-center">
          <div
            className="sm:w-10/12 flex flex-col mt-8 
            w-full px-1 pt-5 pb-5 space-y-2 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center space-x-1">
                <TypographyH2>Indication Annotations</TypographyH2>
              </div>
              <button
                onClick={() => {
                  router.back();
                }}
                className="bg-purple-700 rounded p-2 
                text-white hover:bg-purple-800"
              >
                <img
                  src="https://icons.getbootstrap.com/assets/icons/arrow-return-left.svg"
                  alt="back"
                />
              </button>
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
                className="flex bg-sky-800 rounded-lg sm:h-[60vh]
                    basis-1/3
                    overflow-y-auto p-4 flex-wrap gap-2 content-start"
              >
                {selectedWords.map((word, index) => {
                  const isHovered = hoveredIndex === index;
                  return (
                    <div
                      key={index}
                      className="flex items-center bg-purple-400 rounded-lg
                            truncate overflow-x-auto
                            h-8 px-2 py-1 relative"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div
                        className={`text-black font-medium whitespace-nowrap transition-transform duration-1000 ${
                          isHovered && word.length > 15 ? "animate-scroll" : ""
                        }`}
                        style={{
                          // Create a scrolling animation for long text when hovered
                          animation:
                            isHovered && word.length > 15
                              ? `scrollText ${Math.max(word.length / 10, 3)}s linear infinite alternate`
                              : "none",
                        }}
                      >
                        {word}
                      </div>
                      <button
                        className="flex items-center justify-center
                                absolute right-0 top-0
                                rounded-full bg-red-400 
                                hover:bg-red-500 transition-colors"
                        aria-label={`Remove ${word}`}
                        onClick={(e) => {
                          e.preventDefault();
                          let copyWords = [...selectedWords];
                          copyWords.splice(index, 1);
                          setSelectedWords([...copyWords]);
                        }}
                      >
                        <img src="https://icons.getbootstrap.com/assets/icons/x-circle.svg" />
                      </button>
                    </div>
                  );
                })}
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
    </ProtectedRoute>
  );
}
