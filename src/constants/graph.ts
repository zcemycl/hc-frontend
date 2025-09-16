import {
  BOOKMARK_ICON_URI,
  CAPSULE_ICON_URI,
  COLLECTION_FILL_ICON_URI,
  FLAG_FILL_ICON_URI,
  FUNNEL_FILL_ICON_URI,
  INFO_CIRCLE_FILL_ICON_URI,
  SLIDERS_ICON_URI,
} from "@/icons/bootstrap";
import { graph_node_bg_color_enum } from "./color";

export enum GraphDirectionEnum {
  updown = "UD",
  downup = "DU",
  leftright = "LR",
  rightleft = "RL",
}

export enum GraphTypeEnum {
  hierarchical = "hierarchical",
  radial = "radial",
}

export enum GraphTabEnum {
  initialisation = "init",
  information = "info",
  settings = "settings",
  filters = "filters",
  bundle = "bundle",
}

export const ToolBarTabCouples = [
  [GraphTabEnum.information, INFO_CIRCLE_FILL_ICON_URI],
  [GraphTabEnum.initialisation, FLAG_FILL_ICON_URI],
  [GraphTabEnum.settings, SLIDERS_ICON_URI],
  [GraphTabEnum.filters, FUNNEL_FILL_ICON_URI],
  [GraphTabEnum.bundle, COLLECTION_FILL_ICON_URI],
];

export const therapeutic_area_group_graph_style = {
  color: graph_node_bg_color_enum.ta,
  font: {
    color: "white",
  },
  shape: "image",
  image: BOOKMARK_ICON_URI,
  mass: 8,
  level: 3,
  imagePadding: {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1,
  },
  shadow: {
    enabled: true,
    color: "white",
  },
  shapeProperties: {
    borderRadius: 6,
    interpolation: true,
    useBorderWithImage: true,
    useImageSize: false,
  },
};

export const drug_product_group_graph_style = {
  font: {
    color: "white",
  },
  color: {
    border: graph_node_bg_color_enum.p,
    background: graph_node_bg_color_enum.p,
    highlight: {
      border: "lightgreen",
      Background: graph_node_bg_color_enum.p,
    },
  },
  level: 10,
  shape: "circularImage",
  image: CAPSULE_ICON_URI,
  imagePadding: {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1,
  },
};

export const bundle_group_graph_style = {
  color: graph_node_bg_color_enum.b,
  // shape: "box",
  shape: "dot",
  // shape: "database",
  level: 11,
  size: 50,
  font: {
    color: "white",
    size: 40,
  },
};

export const global_graph_node_style = {
  borderWidth: 2,
};

export const global_graph_edge_style = {
  color: "#FFFFFF",
  arrows: "to",
  width: 1,
  // smooth: {
  //   type: "cubicBezier",
  //   forceDirection:"vertical",
  //   roundness: 0.4,
  // },
};

const defaultOptions = {
  autoResize: true,
  edges: global_graph_edge_style,
  nodes: global_graph_node_style,
  interaction: { hover: true, multiselect: true },
  physics: {
    // barnesHut: {
    //   gravitationalConstant: -80000,
    //   springConstant: 0.001,
    //   springLength: 200,
    // },
    // wind:{
    //   x: 0, y: 1
    // },
    wind: {
      x: 1,
      y: 0,
    },
    // hierarchicalRepulsion: {
    //   avoidOverlap: 2,
    // },
  },
  groups: {
    ta: therapeutic_area_group_graph_style,
    p: drug_product_group_graph_style,
    b: bundle_group_graph_style,
  },
};

export function generateGraphOption({
  graph_type,
  graph_direction = GraphDirectionEnum.leftright,
  enabled_physics = true,
  physics_stabilisation = true,
}: {
  graph_type: GraphTypeEnum;
  graph_direction: GraphDirectionEnum;
  enabled_physics: boolean;
  physics_stabilisation: boolean;
}) {
  let options: any = { ...defaultOptions };
  if (graph_type === GraphTypeEnum.hierarchical) {
    options = {
      ...options,
      layout: {
        randomSeed: 1,
        improvedLayout: true,
        hierarchical: {
          direction: graph_direction,
          sortMethod: "directed",
        },
      },
    };
  }

  let physics_settings: any = {
    enabled: enabled_physics,
    adaptiveTimestep: true,
    barnesHut: {
      gravitationalConstant: -8000,
      springConstant: 0.04,
      springLength: 95,
    },
    stabilization: physics_stabilisation,
  };

  if (graph_type === GraphTypeEnum.radial) {
  }
  options = {
    ...options,
    physics: physics_settings,
  };
  return options;
}

export const toggleOptions = [
  {
    key: "p",
    displayName: "Drug",
  },
  {
    key: "ta",
    displayName: "Therapeutic Area",
  },
  {
    key: "b",
    displayName: "Bundle",
  },
];
