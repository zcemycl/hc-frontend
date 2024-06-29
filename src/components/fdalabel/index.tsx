"use client";
import { IBaseTitleContent } from "@/types";
import { useEffect } from "react";

interface ITitleContentProps {
  data: IBaseTitleContent;
  includeTitle: boolean;
}

function TitleContent({ data, includeTitle }: ITitleContentProps) {
  useEffect(() => {
    console.log(data);
  }, []);
  if (data.tag === "title" && includeTitle) {
    return (
      <h3 className="text-white text-lg mb-1 font-medium title-font">
        {data.content}
      </h3>
    );
  } else if (data.tag === "content") {
    return <p>{data.content}</p>;
  }
}

export { TitleContent };
