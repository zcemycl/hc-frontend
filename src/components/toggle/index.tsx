"use client";
import { useState, useEffect } from "react";

const ToggleButton = ({
  defaultValue,
  handleCallback,
}: {
  defaultValue: boolean;
  handleCallback: (x: boolean) => void;
}) => {
  const [enable, setEnable] = useState<boolean>(defaultValue);

  useEffect(() => {
    handleCallback(enable);
  }, [enable]);

  return (
    <div className="p-1 rounded-full max-w-fit flex bg-inherit">
      <button
        className="bg-white flex relative 
                    h-[20px] w-[40px] rounded-full
                    align-middle
                    content-center items-center"
        onClick={() => {
          setEnable(!enable);
        }}
      >
        <div
          data-testid="dot"
          className={`absolute bg-slate-800 w-[20px] 
                        aspect-square rounded-full
                        transition duration-150 z-0
                        ${enable ? "translate-x-full" : ""}
                        `}
        ></div>
      </button>
    </div>
  );
};

export { ToggleButton };
