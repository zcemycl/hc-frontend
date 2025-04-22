"use client";
import { ARROW_RETURN_ICON_URI } from "@/icons/bootstrap";
import { useRouter } from "next/navigation";

const BackBtn = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.back();
      }}
      className="bg-sky-300 rounded p-2 
        h-fit w-fit
        text-white hover:bg-sky-500"
    >
      <img src={ARROW_RETURN_ICON_URI} alt="back" />
    </button>
  );
};

export { BackBtn };
