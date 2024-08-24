export enum AnnotationTypeEnum {
  AI = "ai",
  COMPLETE = "complete",
  ONGOING = "ongoing",
}

export const annotationTypeMap = [
  {
    queryType: "ongoing",
    queryDisplayName: "Ongoing",
  },
  {
    queryType: "complete",
    queryDisplayName: "Complete",
  },
  {
    queryType: "ai",
    queryDisplayName: "AI",
  },
];
