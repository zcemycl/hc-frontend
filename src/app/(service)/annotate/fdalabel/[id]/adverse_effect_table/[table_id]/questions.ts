export const questions = [
  {
    displayName:
      "Select Cell that is an adverse effect. (DON'T select ae group)",
    mapMode: "cell",
    identifier: "isAdverseEffect",
  },
  {
    displayName: "Select Row that has statistics of adverse effect.",
    mapMode: "row",
    identifier: "isAdverseEffectPair",
  },
  {
    displayName: "Select Rows that are headings.",
    mapMode: "row",
    identifier: "isHeading",
  },
  {
    displayName: "Select Rows that are appendices, like captions.",
    mapMode: "row",
    identifier: "isAppendix",
  },
  {
    displayName: "Select Rows that are group names of adverse effect.",
    mapMode: "row",
    identifier: "isAdverseEffectGroupName",
  },
  {
    displayName:
      "Select Cols that contains statistics of the adverse effect, \nAND select which type of statistics (number+percent, percent, number).",
    mapMode: "col",
    identifier: "isAdverseEffectStatType",
    additionalRequire: {
      dropdown: {
        displayName: "Statistics Type",
        identifier: "statstype",
        type: "dropdown",
        defaultOption: "np",
        options: [
          {
            displayName: "number+percent",
            type: "np",
          },
          {
            displayName: "percent",
            type: "p",
          },
          {
            displayName: "number",
            type: "n",
          },
          {
            displayName: "percent+number",
            type: "pn",
          },
        ],
      },
    },
  },
  {
    displayName: "Choose table type.",
    mapMode: "none",
    identifier: "tableType", // reqire to include identifier for showing question in ai
    additionalRequire: {
      dropdown: {
        displayName: "Table Type",
        identifier: "tabletype",
        type: "dropdown",
        defaultOption: "ae",
        options: [
          {
            displayName: "Adverse Effect Table",
            type: "ae",
          },
          {
            displayName: "Laboratory Test Table",
            type: "lt",
          },
          {
            displayName: "Adverse Effect List No Number",
            type: "aenonum",
          },
          {
            displayName: "Unclassified",
            type: "unclassified",
          },
        ],
      },
    },
  },
];
