"use client";
import { X_CIRCLE_ICON_URI } from "@/icons/bootstrap";
import { Copy, CopyCheck } from "lucide-react";
import { useEffect, useState } from "react";

const CompositeCorner = ({
  label,
  click_callback,
  del_callback,
  enable_copy = false,
}: {
  label: string;
  click_callback: () => void;
  del_callback?: () => void;
  enable_copy?: boolean;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);
  return (
    <div
      className="relative w-full
        flex flex-row gap-2 flex-wrap items-center"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        click_callback();
      }}
    >
      <div
        className={`text-black font-medium whitespace-nowrap
            transition-transform duration-1000`}
      >
        {label}
      </div>
      {enable_copy && (
        <button
          className={`flex items-center justify-center 
        p-1 rounded-lg my-1
        transition-all
        ${isCopied ? "bg-green-700" : "bg-gray-400"}`}
          aria-label={`Copy ${label}`}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              await navigator.clipboard.writeText(label);
              setIsCopied(true);
            } catch (err) {
              console.error("Failed to copy:", err);
            }
            setIsCopied(true);
          }}
        >
          {isCopied ? (
            <CopyCheck className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-black" />
          )}
        </button>
      )}
      {del_callback && (
        <button
          className="flex items-center justify-center
                absolute -top-2 -right-2
                rounded-full bg-red-400
                translate-x-2 z-10
                hover:bg-red-500 transition-colors"
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            del_callback();
          }}
        >
          <img src={X_CIRCLE_ICON_URI} />
        </button>
      )}
    </div>
  );
};

export { CompositeCorner };
