import { graph_node_bg_color_enum } from "./color";

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
  // smooth: {
  //   type: "cubicBezier",
  //   forceDirection:"vertical",
  //   roundness: 0.4,
  // },
};
