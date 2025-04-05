"use client";

import { useCallback } from "react";

export default function TextUpdateNode({
  data,
  isConnectable,
}: {
  data: any;
  isConnectable: boolean;
}) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return <></>;
}
