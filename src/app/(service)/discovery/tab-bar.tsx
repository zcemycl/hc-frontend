import { useContext } from "react";
import { DiscoveryContext } from "@/contexts";
import { GraphTabEnum } from "@/constants";

export default function TabBar() {
  const { tab, setTab } = useContext(DiscoveryContext);
  return (
    <div className="flex flex-row space-x-2 pl-3 w-fit object-fit pointer-events-auto">
      {[
        [
          GraphTabEnum.information,
          "https://icons.getbootstrap.com/assets/icons/info-circle-fill.svg",
        ],
        [
          GraphTabEnum.initialisation,
          "https://icons.getbootstrap.com/assets/icons/flag.svg",
        ],
        [
          GraphTabEnum.settings,
          "https://icons.getbootstrap.com/assets/icons/sliders.svg",
        ],
      ].map((v) => {
        return (
          <button
            key={`tab-${v[0]}`}
            className={`p-2
                ${tab === v[0] ? "bg-sky-800 border-b-2" : "bg-sky-500"}
                rounded-b-lg hover:bg-sky-800`}
            onClick={() => setTab(v[0])}
          >
            <img src={v[1]} />
          </button>
        );
      })}
    </div>
  );
}
