const switch_color_node = (group: string) => {
  switch (group) {
    case "ta":
      return `bg-purple-300`;
    case "p":
      return "bg-sky-500";
    default:
      return "bg-white";
  }
};

const switch_hover_color_node = (group: string) => {
  switch (group) {
    case "ta":
      return `hover:bg-purple-400`;
    case "p":
      return "hover:bg-sky-700";
    default:
      return "hover:bg-white";
  }
};

export { switch_color_node, switch_hover_color_node };
