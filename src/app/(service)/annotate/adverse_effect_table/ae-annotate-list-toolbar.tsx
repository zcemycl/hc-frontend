import { BackBtn, TypographyH2, VerToolbar } from "@/components";
import { AnnotationTypeDropdown } from "./AnnotationTypeDropdown";
import { AnnotationTypeEnum } from "@/constants";
import { useRouter } from "next/navigation";
import { Fragment, useContext } from "react";
import { FdaVersionsContext, useAETableAnnotation } from "@/contexts";

export default function AEAnnotateListToolbar() {
  const router = useRouter();
  const { versions } = useContext(FdaVersionsContext);
  const {
    aePageCache,
    tabName,
    setTabName,
    saveAETableAnnotationPageCache,
    pageN,
    setPageN,
    aiPageN,
    ongoingPageN,
    completePageN,
  } = useAETableAnnotation();
  return (
    <Fragment>
      <div
        className="sm:w-1/2 flex flex-col mt-8 
            w-full px-1 pt-5 pb-5 space-y-2"
      >
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center space-x-1">
            <TypographyH2>AE Table Annotations</TypographyH2>
            <AnnotationTypeDropdown
              queryType={tabName}
              setQueryType={(q) => {
                setTabName(q);
                let tmpCache = aePageCache;
                let pageN_ = pageN;
                if (q === AnnotationTypeEnum.AI && "aiPageN" in tmpCache) {
                  // setPageN(tmpCache["aiPageN"] as number);
                  setPageN(aiPageN);
                  // pageN_ = tmpCache["aiPageN"] as number;
                }
                if (
                  q === AnnotationTypeEnum.COMPLETE &&
                  "completePageN" in tmpCache
                ) {
                  // setPageN(tmpCache["completePageN"] as number);
                  setPageN(completePageN);
                  // pageN_ = tmpCache["completePageN"] as number;
                }
                if (
                  q === AnnotationTypeEnum.ONGOING &&
                  "ongoingPageN" in tmpCache
                ) {
                  // setPageN(tmpCache["ongoingPageN"] as number);
                  setPageN(ongoingPageN);
                  // pageN_ = tmpCache["ongoingPageN"] as number;
                }
                saveAETableAnnotationPageCache(q);
              }}
              additionalResetCallback={() => {}}
            />
          </div>

          <BackBtn
            customCallBack={() => {
              saveAETableAnnotationPageCache();
              router.back();
            }}
          />
        </div>
      </div>
      <div
        className="flex flex-row space-y-2 align-center
                sm:w-1/2 w-full"
      >
        <VerToolbar
          fdaSections={["fdalabel", "adverse_effect_table"]}
          reloadCallback={() => {}}
        />
      </div>
    </Fragment>
  );
}
