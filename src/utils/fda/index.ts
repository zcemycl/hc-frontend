import { ITherapeuticAreaGroupTables, IUnAnnotatedAETable } from "@/types";

export const transformData = (list: IUnAnnotatedAETable[]) => {
  return list.reduce(
    (
      acc: ITherapeuticAreaGroupTables,
      item: IUnAnnotatedAETable,
      curIdx: number,
    ) => {
      const key = String(item.therapeutic_area!.name) as string;
      if (!acc[key]) {
        acc[key] = [];
      }
      item.relative_idx = curIdx;
      acc[key].push(item);
      return acc;
    },
    {},
  );
};
