import { IQuestionTemplate } from "@/types";

export const SubmitAnnotate = ({
  questionIdx,
  questions,
  click_callback,
}: {
  questionIdx: number;
  questions: IQuestionTemplate[];
  click_callback: () => void;
}) => {
  return (
    <button
      className={`bg-emerald-500 text-black font-bold
            hover:bg-emerald-300 transition
            rounded p-2 origin-left
            ${
              questionIdx === questions.length - 1
                ? "scale-x-100 scale-y-100"
                : "scale-x-0 scale-y-0"
            }`}
      onClick={async (e) => {
        e.preventDefault();
        click_callback();
      }}
    >
      Submit
    </button>
  );
};
