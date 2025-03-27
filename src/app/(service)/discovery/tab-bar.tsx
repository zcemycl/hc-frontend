import { useContext } from "react";
import { DiscoveryContext } from "./context";

export default function TabBar() {
  const { tab, setTab } = useContext(DiscoveryContext);
  return (
    <div className="flex flex-row space-x-2 pl-3 w-fit object-fit pointer-events-auto">
      <button
        className={`p-2
            ${tab === "info" ? "bg-sky-800 border-b-2" : "bg-sky-500"}
            rounded-b-lg hover:bg-sky-800`}
        onClick={() => setTab("info")}
      >
        <img src="https://icons.getbootstrap.com/assets/icons/info-circle-fill.svg" />
      </button>
      <button
        className={`p-2
            ${tab === "init" ? "bg-sky-800 border-b-2" : "bg-sky-500"}
            rounded-b-lg hover:bg-sky-800`}
        onClick={() => setTab("init")}
      >
        <img src="https://icons.getbootstrap.com/assets/icons/flag.svg" />
      </button>
      <button
        className={`p-2 
            ${tab === "settings" ? "bg-sky-800 border-b-2" : "bg-sky-500"}
            rounded-b-lg hover:bg-sky-800`}
        onClick={() => setTab("settings")}
      >
        <img src="https://icons.getbootstrap.com/assets/icons/sliders.svg" />
      </button>
    </div>
  );
}
