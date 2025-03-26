import {
  drug_product_group_graph_style,
  global_graph_edge_style,
  global_graph_node_style,
  therapeutic_area_group_graph_style,
} from "@/constants";
import { useContext } from "react";
import { DiscoveryContext } from "./context";

const defaultOptions = {
  autoResize: true,
  layout: {
    hierarchical: {
      direction: "LR",
      sortMethod: "directed",
    },
  },
  edges: global_graph_edge_style,
  nodes: global_graph_node_style,
  interaction: { hover: true },
  physics: {
    // stabilization: false,
    // stabilization: true,
    // barnesHut: {
    //   gravitationalConstant: -80000,
    //   springConstant: 0.001,
    //   springLength: 200,
    // },
    // enabled: true,
    // wind:{
    //   x: 0, y: 1
    // },
    enabled: false,
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

export default function SettingsTab() {
  const { tab } = useContext(DiscoveryContext);
  return (
    <div
      className={`absolute
            left-0 right-0 top-0 bottom-0
            self-end
            space-y-1
            overflow-y-auto
            w-full h-full
            transition
            p-5
            ${
              tab === "settings"
                ? "opacity-100 z-10 delay-200"
                : "opacity-0 z-0 duration-200"
            }
            `}
    >
      <h2 className="leading text-slate-300 font-bold">Settings</h2>
    </div>
  );
}
