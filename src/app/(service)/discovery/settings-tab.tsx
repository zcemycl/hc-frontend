/* eslint-disable @next/next/no-img-element */
import { GraphDirectionEnum, GraphTypeEnum } from "@/constants";
import { useContext, useState } from "react";
import { DiscoveryContext } from "./context";

export default function SettingsTab() {
  const { tab } = useContext(DiscoveryContext);
  const { settings, defineSettings } = useContext(DiscoveryContext);
  const [graphType, setGraphType] = useState<GraphTypeEnum>(
    settings.graph_type,
  );
  const [graphDirection, setGraphDirection] = useState<GraphDirectionEnum>(
    settings.graph_direction,
  );
  const [enabledPhysics, setEnabledPhysics] = useState<boolean>(
    settings.enabled_physics,
  );

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
            flex flex-col
            ${
              tab === "settings"
                ? "opacity-100 z-10 delay-200"
                : "opacity-0 z-0 duration-200"
            }
            `}
    >
      <div className="basis-11/12 space-y-2">
        <h2 className="leading text-slate-300 font-bold">Settings</h2>
        <div
          className="flex flex-row space-x-2
          justify-between
          p-2 rounded-lg
          content-center align-middle items-center
          bg-amber-500
        "
        >
          <span className="text-black">Graph Type</span>
          <div className="flex flex-row space-x-1">
            <button
              className={`aspect-square hover:bg-amber-600 
              ${graphType === GraphTypeEnum.hierarchical ? "bg-amber-600" : "bg-amber-200"}
              rounded-lg h-fit p-2`}
              onClick={(e) => {
                e.preventDefault();
                setGraphType(GraphTypeEnum.hierarchical);
              }}
            >
              <img
                className="aspect-square"
                src="https://icons.getbootstrap.com/assets/icons/diagram-3.svg"
                alt="hierarchical"
              />
            </button>
            <button
              className={`aspect-square hover:bg-amber-600 
              ${graphType === GraphTypeEnum.radial ? "bg-amber-600" : "bg-amber-200"}
              rounded-lg h-fit p-2`}
              onClick={(e) => {
                e.preventDefault();
                setGraphType(GraphTypeEnum.radial);
              }}
            >
              <img
                className="aspect-square"
                src="https://icons.getbootstrap.com/assets/icons/broadcast.svg"
                alt="radial"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="basis-1/12 flex flex-row justify-end">
        <button
          className="bg-emerald-500
                    hover:bg-emerald-200 rounded-full 
                    h-full aspect-square
                    justify-end align-middle
                    content-center"
          onClick={(e) => {
            e.preventDefault();
            defineSettings({
              graph_type: graphType,
              graph_direction: graphDirection,
              enabled_physics: enabledPhysics,
            });
          }}
        >
          <img
            src="https://icons.getbootstrap.com/assets/icons/play-fill.svg"
            className="w-full"
            alt="submit"
          />
        </button>
      </div>
    </div>
  );
}
