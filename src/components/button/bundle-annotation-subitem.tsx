import {
  AnnotationCategoryEnum,
  IAnnotationRef,
  IAnnotationSourceMap,
} from "@/types";
import { useMemo } from "react";
import { CompositeCorner } from "./composite-corner";

const BundleAnnotationSubItem = ({
  ann,
  annSource,
  annotationClickCallback,
  annotationDelCallback,
}: {
  ann: IAnnotationRef;
  annSource: IAnnotationSourceMap;
  annotationClickCallback?: (
    setid: string,
    category: AnnotationCategoryEnum,
    table_id: number | string,
  ) => void;
  annotationDelCallback?: () => void;
}) => {
  const source = useMemo(() => {
    return annSource[ann.id];
  }, [annSource]);
  const showText = useMemo(() => {
    let showText_ = `${ann.category} - ${ann.table_id} - ${ann.id}`;
    if (source !== undefined) {
      if (source.category === AnnotationCategoryEnum.ADVERSE_EFFECT_TABLE) {
        showText_ = `${source.fdalabel.tradename} - ${source.category} - Table ${source.relative_id}`;
      }
    }
    return showText_;
  }, [ann, source]);
  return (
    <div
      className="px-2 bg-emerald-400 
            rounded-lg font-semibold text-black
            hover:bg-emerald-600
            hover:scale-105 duration-200
            transition-all cursor-pointer
            "
      key={`bundle-annotation-${ann.id}`}
    >
      <CompositeCorner
        {...{
          label: showText,
          click_callback: annotationClickCallback
            ? () =>
                annotationClickCallback(
                  source.fdalabel.setid as string,
                  source.category,
                  source.relative_id as number,
                )
            : () => {},
          del_callback: annotationDelCallback
            ? () => annotationDelCallback()
            : undefined,
        }}
      />
    </div>
  );
};

export { BundleAnnotationSubItem };
