"use client";
import { useRouter } from "next/navigation";

const BackBtn = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.back();
      }}
      className="bg-sky-300 rounded p-2 
            text-white hover:bg-sky-500"
    >
      <img
        src="https://icons.getbootstrap.com/assets/icons/arrow-return-left.svg"
        alt="back"
      />
    </button>
  );
};

export { BackBtn };
