"use client";
import { useEffect, useState } from "react";

interface HTMLTypingAnimationProps {
  html: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void; // Called when typing animation is complete
  onCharacterTyped?: () => void; // Called after each character is typed
}

export const HTMLTypingAnimation: React.FC<HTMLTypingAnimationProps> = ({
  html,
  speed = 50,
  onComplete,
  onCharacterTyped,
}) => {
  const [displayedHTML, setDisplayedHTML] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < html.length) {
      const timer = setTimeout(() => {
        setDisplayedHTML((prev) => prev + html[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        // Call onCharacterTyped after each character is added
        if (onCharacterTyped) {
          onCharacterTyped();
        }
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === html.length && onComplete) {
      console.log("final html", displayedHTML);
      onComplete();
    }
  }, [currentIndex, html, speed, onComplete, onCharacterTyped]);

  // Reset when html changes
  useEffect(() => {
    setDisplayedHTML("");
    setCurrentIndex(0);
  }, [html]);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: displayedHTML }} />
      {currentIndex < html.length && <span className="animate-pulse">|</span>}
    </div>
  );
};
