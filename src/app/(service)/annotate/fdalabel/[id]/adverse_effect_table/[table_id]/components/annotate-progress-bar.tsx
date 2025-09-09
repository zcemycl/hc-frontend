import { IQuestionTemplate } from "@/types";
import { SubmitAnnotate } from "./submit-annotate";
import { PaginationBar2 } from "@/components";

export const AnnotateProgressBar = ({
  questions,
  pageN,
  setPageN,
  submit_callback,
}: {
  questions: IQuestionTemplate[];
  pageN: number;
  setPageN: (i: number) => void;
  submit_callback?: () => void;
}) => {
  return (
    <div className="flex space-x-2 items-center">
      {/* slidebar */}
      <PaginationBar2
        {...{
          topN: questions.length,
          pageN,
          nPerPage: 1,
          setPageN,
        }}
      />
      {submit_callback && (
        <SubmitAnnotate
          {...{
            questionIdx: pageN,
            questions: questions as IQuestionTemplate[],
            click_callback: submit_callback,
          }}
        />
      )}
    </div>
  );
};
