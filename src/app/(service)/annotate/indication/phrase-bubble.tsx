"use client";
import { useContext } from "react";
import { SelectedWordsContext } from "@/contexts";

const PhraseBubble = ({
  word,
  index,
  isHovered,
}: {
  word: string;
  index: number;
  isHovered: boolean;
}) => {
  const { setHoveredIndex, setSelectedWords, selectedWords } =
    useContext(SelectedWordsContext);
  return (
    <div
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
};

export { PhraseBubble };
