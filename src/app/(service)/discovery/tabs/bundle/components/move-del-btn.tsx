import { INode } from "@/types";
import { switch_color_node, switch_hover_color_node } from "../../../utils";
import { X_CIRCLE_ICON_URI } from "@/icons/bootstrap";
import { CompositeCorner } from "@/components";

export const MoveDelBtn = ({
  node,
  idx,
  click_callback,
  del_callback,
}: {
  node: INode;
  idx: number;
  click_callback: (vid: number | string) => void;
  del_callback: (vid: number | string, idx: number) => void;
}) => {
  return (
    <div
      className={`flex items-center rounded-lg
            overflow-visible
            ${switch_color_node(node.group as string)}
            ${switch_hover_color_node(node.group as string)}
            cursor-pointer
            h-8 px-3 py-1`}
    >
      <CompositeCorner
        {...{
          label: node.label,
          click_callback: () => click_callback(node.id),
          del_callback: () => del_callback(node.id, idx),
        }}
      />
    </div>
  );
};
