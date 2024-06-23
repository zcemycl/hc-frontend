"use client";
import { FC, ReactNode, RefObject } from "react";

const DropDownBtn: FC<{
  children: ReactNode;
  forwardRef?: RefObject<HTMLButtonElement>;
  extraClassName?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({ children, extraClassName, forwardRef, ...props }) => {
  return (
    <button
      ref={forwardRef}
      className={`inline-flex items-center 
            border-2
            border-indigo-900
            p-2 w-auto h-10 mr-1 justify-center 
            text-sm text-gray-500 rounded-lg 
            hover:bg-gray-100 focus:outline-none 
            focus:ring-2 focus:ring-gray-200 
            dark:text-gray-400 dark:hover:bg-gray-700 
            dark:focus:ring-gray-600
            ${extraClassName}
        `}
      aria-controls="navbar-dropdown"
      aria-expanded="false"
      data-collapse-toggle="navbar-dropdown"
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

const DropDownItem: FC<{
  children?: ReactNode;
  selected?: string;
  displayNameKey: string;
  selectionKey: string;
  optionKeyVal: {
    [key: string]: string;
  };
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({
  children,
  selected,
  displayNameKey,
  selectionKey,
  optionKeyVal,
  ...props
}) => {
  return (
    <li
      className={`
          rounded 
          ${selected === optionKeyVal[selectionKey] ? "bg-indigo-600" : "bg-indigo-500"}`}
    >
      <button
        className={`text-white
            ${selected === optionKeyVal[selectionKey] ? "bg-indigo-600" : "bg-indigo-500"}
            border-0
            w-full
            py-2
            px-5 
            focus:outline-none 
            hover:bg-indigo-600 
            rounded 
            text-sm`}
        {...props}
      >
        {children ? children : optionKeyVal[displayNameKey]}
      </button>
    </li>
  );
};

const DropDownList: FC<{
  selected: string;
  displayNameKey: string;
  selectionKey: string;
  allOptions: { [key: string]: string }[];
  isOpen: boolean;
  resetCallback: Function;
  setSelectionKey: (s: any) => void;
}> = ({
  selected,
  displayNameKey,
  selectionKey,
  allOptions,
  isOpen,
  resetCallback,
  setSelectionKey,
  ...props
}) => {
  return (
    <div
      className={`items-center 
                z-10 justify-between w-auto 
                transition-transform 
                ${isOpen ? "scale-y-100" : "scale-y-0"}`}
      id="navbar-dropdown"
    >
      <ul
        className="flex flex-col border-indigo-900 
        border-l-2 border-r-2 border-b-2 rounded"
      >
        {allOptions.map((keyValue) => {
          return (
            <DropDownItem
              key={keyValue[selectionKey]}
              selected={selected}
              displayNameKey={displayNameKey}
              selectionKey={selectionKey}
              optionKeyVal={keyValue}
              onClick={(e) => {
                e.preventDefault();
                setSelectionKey(keyValue[selectionKey]);
                resetCallback();
              }}
              {...props}
            />
          );
        })}
      </ul>
    </div>
  );
};

export { DropDownBtn, DropDownItem, DropDownList };
