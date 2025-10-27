"use client";
import {
  AnnotationCategoryEnum,
  IAnnotationSourceMap,
  IBundle,
  IFdaLabelRef,
} from "@/types";
import { useRouter } from "next/navigation";
import { Plus, X, Info, Pen } from "lucide-react";
import { BundleFdalabelSubItem } from "./bundle-fdalabel-subitem";
import { BundleAnnotationSubItem } from "./bundle-annotation-subitem";

const BundleListItem = ({
  b,
  annSource,
  isExpand,
  expandInfoCallback,
  editCallback,
  delCallback,
  addCallback,
  fdaClickCallback,
  fdaDelCallback,
  annotationClickCallback,
  annotationDelCallback,
}: {
  b: IBundle;
  annSource: IAnnotationSourceMap;
  isExpand: boolean;
  expandInfoCallback?: () => void;
  editCallback?: () => void;
  delCallback?: () => void;
  addCallback?: () => void;
  fdaClickCallback?: (s: string) => void;
  fdaDelCallback?: (s: string) => void;
  annotationClickCallback?: (
    setid: string,
    category: AnnotationCategoryEnum,
    table_id: number | string,
  ) => void;
  annotationDelCallback?: () => void;
}) => {
  const router = useRouter();
  let useFor: string = "Not In Use";
  if (b.annotations.length === 0 && b.fdalabels.length === 0) {
    useFor = "Not In Use";
  } else if (b.annotations.length === 0 && b.fdalabels.length > 0) {
    useFor = "Fdalabel";
  } else if (b.annotations.length > 0 && b.fdalabels.length === 0) {
    useFor = "Annotation";
  }
  return (
    <div
      key={`${b.name}-group-btn`}
      onClick={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append("id", b.id);
        router.push(`/bundle?${params}`);
      }}
      className="px-3 py-2 text-clip
        flex rounded-lg border-emerald-200 border-2
        text-white cursor-pointer
        hover:bg-emerald-500 hover:text-black
        justify-between flex-col
      "
    >
      <div
        className="flex flex-row 
        justify-between font-bold"
      >
        <div
          className="flex flex-row justify-start
          space-x-2 text-clip min-w-0 basis-2/3"
        >
          <span
            className="overflow-hidden text-ellipsis 
            whitespace-nowrap flex-shrink min-w-0"
          >
            {b.name}
          </span>
          <span
            className="bg-amber-300 rounded-lg px-3 text-black 
            flex-shrink-0 whitespace-nowrap"
          >
            {useFor}
          </span>
        </div>

        <div
          id="sub-buttons"
          className="
            flex flex-row space-x-2
            items-center basis-1/3 justify-end"
        >
          {expandInfoCallback && (
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await expandInfoCallback!();
              }}
            >
              <Info
                className="rounded-full 
                  bg-sky-300 hover:bg-sky-700
                  text-black
                  hover:text-white"
              />
            </button>
          )}
          {addCallback && (
            <button
              className="leading-[0px] m-0
            text-black"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await addCallback!();
              }}
            >
              <Plus
                className="rounded-lg
                hover:bg-green-500 bg-green-300
                text-black
                hover:text-white"
              />
            </button>
          )}
          {editCallback && (
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await editCallback!();
              }}
            >
              <Pen
                className="p-1
                  rounded-lg bg-purple-400
                  hover:bg-purple-600
                  text-black
                  hover:text-white"
              />
            </button>
          )}
          {delCallback && (
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await delCallback!();
              }}
            >
              <X
                className="rounded-lg
                bg-red-500
                hover:bg-red-700
                text-black
                hover:text-white"
              />
            </button>
          )}
        </div>
      </div>
      <div
        id="hide-ele"
        className={`transition-all
                    origin-top overflow-hidden duration-150
                    flex flex-col space-y-1
                    ${isExpand ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <span>{b.description}</span>
        <div className="flex flex-row gap-2 flex-wrap">
          {b.fdalabels.map((f: IFdaLabelRef) => (
            <BundleFdalabelSubItem
              key={`bundle-drug-${f.setid}`}
              {...{
                f,
                fdaClickCallback,
                fdaDelCallback,
              }}
            />
          ))}
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          {b.annotations.map((suba) => (
            <BundleAnnotationSubItem
              key={`bundle-annotation-${suba.id}`}
              {...{
                ann: suba,
                annSource,
                annotationClickCallback,
                annotationDelCallback,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { BundleListItem };
