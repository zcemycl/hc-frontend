import { DropDownBtn, DropDownList } from "@/components";
import { IDropdownOption, IQuestionTemplate } from "@/types";
import { Dispatch, Fragment, SetStateAction, useState } from "react";

export const AnnotateDropdown = ({
  questions,
  questionIdx,
  selectedOption,
  setSelectedOption,
  isEnabled = true,
}: {
  questions: IQuestionTemplate[];
  questionIdx: number;
  selectedOption: string;
  setSelectedOption?: Dispatch<SetStateAction<string>>;
  isEnabled?: boolean;
}) => {
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  return (
    <div
      className={`transition
        origin-top
        ${questions?.[questionIdx] && "additionalRequire" in questions[questionIdx] ? "scale-y-100" : "scale-y-0"}`}
    >
      {questions?.[questionIdx] &&
        "additionalRequire" in questions[questionIdx] && (
          <Fragment>
            <DropDownBtn
              extraClassName="justify-end w-full
            bg-blue-500 hover:bg-blue-700
            text-black"
              onClick={() => {
                if (!isEnabled) return;
                setIsOptionDropdownOpen(!isOptionDropdownOpen);
              }}
            >
              {questions[questionIdx]?.additionalRequire?.dropdown?.displayName}
              :{" "}
              {
                questions[
                  questionIdx
                ].additionalRequire?.dropdown?.options.filter(
                  (each: IDropdownOption) => each.type === selectedOption,
                )[0]?.displayName
              }
            </DropDownBtn>
            {isEnabled && (
              <div className="flex w-full justify-end h-0">
                <DropDownList
                  selected={selectedOption}
                  displayNameKey="displayName"
                  selectionKey="type"
                  allOptions={
                    questions[
                      questionIdx
                    ].additionalRequire?.dropdown?.options.map((opt) => ({
                      type: opt.type,
                      displayName: opt.displayName,
                    })) ?? []
                  }
                  isOpen={isOptionDropdownOpen}
                  setSelectionKey={(s) => {
                    if (!isEnabled) return;
                    setSelectedOption?.(s);
                  }}
                  resetCallback={() => {
                    if (!isEnabled) return;
                    setIsOptionDropdownOpen(false);
                  }}
                />
              </div>
            )}
          </Fragment>
        )}
    </div>
  );
};
