/* eslint-disable @next/next/no-img-element */
import { GraphDirectionEnum, GraphTabEnum, GraphTypeEnum } from "@/constants";
import { useContext, useState } from "react";
import { DiscoveryContext } from "@/contexts";
import { ToggleButton } from "@/components";
import {
  PLAY_FILL_ICON_URI,
  TREE_2_ICON_URI,
  TREE_3_ICON_URI,
  TREE_RADIO_ICON_URI,
  X_CIRCLE_FILL_ICON_URI,
} from "@/icons/bootstrap";

export default function SettingsTab() {
  const { tab, net } = useContext(DiscoveryContext);
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
  const [physicsStabilisation, setPhysicsStabilisation] = useState<boolean>(
    settings.physics_stabilisation,
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
              tab === GraphTabEnum.settings
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
            {[
              [GraphTypeEnum.hierarchical, TREE_3_ICON_URI],
              [GraphTypeEnum.radial, TREE_RADIO_ICON_URI],
            ].map((v) => {
              return (
                <button
                  key={v[0]}
                  className={`aspect-square hover:bg-amber-600 
                  ${graphType === v[0] ? "bg-amber-600" : "bg-amber-200"}
                  rounded-lg h-fit p-2`}
                  onClick={(e) => {
                    e.preventDefault();
                    setGraphType(v[0] as GraphTypeEnum);
                  }}
                >
                  <img className="aspect-square" src={v[1]} alt={v[0]} />
                </button>
              );
            })}
          </div>
        </div>
        {graphType === GraphTypeEnum.hierarchical && (
          <div
            className="flex flex-row space-x-2
          justify-between
          p-2 rounded-lg
          content-center align-middle items-center
          bg-amber-500
        "
          >
            <span className="text-black">Graph Direction</span>
            <div className="flex flex-row space-x-1">
              {[
                [GraphDirectionEnum.leftright, "-rotate-90"],
                [GraphDirectionEnum.rightleft, "rotate-90"],
                [GraphDirectionEnum.updown, ""],
                [GraphDirectionEnum.downup, "rotate-180"],
              ].map((v) => {
                return (
                  <button
                    key={v[0]}
                    className={`aspect-square hover:bg-amber-600 
                  ${graphDirection === v[0] ? "bg-amber-600" : "bg-amber-200"}
                  rounded-lg h-fit p-2`}
                    onClick={(e) => {
                      e.preventDefault();
                      setGraphDirection(v[0] as GraphDirectionEnum);
                    }}
                  >
                    <img
                      className={`aspect-square ${v[1]}`}
                      src={TREE_2_ICON_URI}
                      alt={`hierarchical-${v[0]}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div
          className="flex flex-row space-x-2
          justify-between
          p-2 rounded-lg
          content-center align-middle items-center
          bg-amber-500
        "
        >
          <span className="text-black">Physics Simulation</span>
          <div className="flex flex-row space-x-1 items-center align-middle content-center">
            <span
              className={`transition duration-150
                origin-right text-black
                ${enabledPhysics ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}
                `}
            >
              <img src={X_CIRCLE_FILL_ICON_URI} alt="cross-physics-sim" />
            </span>
            <ToggleButton
              {...{
                defaultValue: enabledPhysics,
                handleCallback: (x: boolean) => {
                  setEnabledPhysics(x);
                },
              }}
            />
          </div>
        </div>
        <div
          className="flex flex-row space-x-2
          justify-between
          p-2 rounded-lg
          content-center align-middle items-center
          bg-amber-500
        "
        >
          <span className="text-black">Physics Stabilisation</span>
          <div className="flex flex-row space-x-1 items-center align-middle content-center">
            <span
              className={`transition duration-150
                origin-right text-black
                ${physicsStabilisation ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}
                `}
            >
              <img src={X_CIRCLE_FILL_ICON_URI} alt="cross-physics-sim" />
            </span>
            <ToggleButton
              {...{
                defaultValue: physicsStabilisation,
                handleCallback: (x: boolean) => {
                  setPhysicsStabilisation(x);
                },
              }}
            />
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <button
            className="p-2 
            rounded-lg text-black
            bg-emerald-600 hover:bg-emerald-200"
            onClick={(e) => {
              e.preventDefault();
              console.log("start simulation ... ");
              net?.setOptions({ physics: true });
              net?.startSimulation();
            }}
          >
            Start Simulation
          </button>
          <button
            className="p-2 
            rounded-lg text-black
            bg-amber-600 hover:bg-amber-200"
            onClick={(e) => {
              e.preventDefault();
              console.log("stop simulation ... ");
              net?.setOptions({ physics: false });
              net?.stopSimulation();
            }}
          >
            Stop Simulation
          </button>
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
              physics_stabilisation: physicsStabilisation,
            });
          }}
        >
          <img src={PLAY_FILL_ICON_URI} className="w-full" alt="submit" />
        </button>
      </div>
    </div>
  );
}
