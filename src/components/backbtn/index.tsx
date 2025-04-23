"use client";
import { ARROW_RETURN_ICON_URI } from "@/icons/bootstrap";
import { useRouter } from "next/navigation";

const BackBtn = ({ customCallBack }: { customCallBack?: () => void }) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (customCallBack) {
          customCallBack();
        } else {
          router.back();
        }
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
