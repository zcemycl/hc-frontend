import { COPY_ICON_URI } from "@/icons/bootstrap";
import { switch_color_node, switch_hover_color_node } from "../../../utils";
import { INode } from "@/types";

interface IProps {
  v: INode;
}

export const SideCopyBtn = ({ v }: IProps) => {
  return (
    <button
      className={`content-center items-center align-middle z-10
                rounded-md ${switch_color_node(v.group!)}
                h-full p-1 ${switch_hover_color_node(v.group!)}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const spanEle = document.getElementById(`label-${v.id}`)?.innerHTML;
        navigator.clipboard.writeText(spanEle?.trim() as string);
      }}
    >
      <img src={COPY_ICON_URI} alt="copy" />
    </button>
  );
};
