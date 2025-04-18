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
  [
    GraphTabEnum.information,
    "https://icons.getbootstrap.com/assets/icons/info-circle-fill.svg",
  ],
  [
    GraphTabEnum.initialisation,
    "https://icons.getbootstrap.com/assets/icons/flag-fill.svg",
  ],
  [
    GraphTabEnum.settings,
    "https://icons.getbootstrap.com/assets/icons/sliders.svg",
  ],
  [
    GraphTabEnum.filters,
    "https://icons.getbootstrap.com/assets/icons/funnel-fill.svg",
  ],
  [
    GraphTabEnum.bundle,
    "https://icons.getbootstrap.com/assets/icons/collection-fill.svg",
  ],
];

export const therapeutic_area_group_graph_style = {
  color: graph_node_bg_color_enum.ta,
  font: {
    color: "white",
  },
  shape: "image",
  image:
    "https://icons.getbootstrap.com/assets/icons/journal-bookmark-fill.svg",
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
  color: graph_node_bg_color_enum.p,
  level: 10,
  shape: "circularImage",
  image: "https://icons.getbootstrap.com/assets/icons/capsule.svg",
  imagePadding: {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1,
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
        hierarchical: {
          direction: graph_direction,
          sortMethod: "directed",
          // sortMethod: 'hubsize',
        },
      },
    };
  }

  let physics_settings: any = {
    enabled: enabled_physics,
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
