"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Network } from "vis-network";
import { FASTAPI_URI } from "@/http/backend/constants";
import { useAuth } from "@/contexts";

interface INode {
  label: string;
  id: number;
}

interface IEdge {
  from: number;
  to: number;
}

export default function VisPanel() {
  const [openToolBar, setOpenToolBar] = useState<boolean>(false);
  const visJsRef = useRef<HTMLDivElement>(null);
  const { credentials } = useAuth();
  const [nodes, setNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);

  useEffect(() => {
    if (credentials.length === 0) return;
    async function getData(credentials: string) {
      const credJson = JSON.parse(credentials);
      const API_URI = `http://localhost:4001/graph/`;
      console.log(API_URI);
      const response = await fetch(API_URI, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${credJson.AccessToken}`,
        },
      });
      const res = await response.json();
      setNodes([
        ...res["ta"].map((v: INode) => ({
          ...v,
          group: "ta",
        })),
        ...res["p"].map((v: INode) => ({
          ...v,
          group: "p",
        })),
      ]);
      setEdges([...res["links"]]);
      console.log(res);
    }
    getData(credentials);
  }, [credentials]);

  useEffect(() => {
    console.log(visJsRef);
    if (visJsRef.current) {
      const network =
        visJsRef.current &&
        new Network(
          visJsRef.current,
          { nodes, edges },
          {
            autoResize: true,
            edges: {
              color: "#FFFFFF",
            },
            nodes: { borderWidth: 2 },
            interaction: { hover: true },
            groups: {
              ta: {
                color: "rgb(201,144,191)",
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
              },
              p: {
                font: {
                  color: "white",
                },
                level: 10,
                shape: "circularImage",
                image:
                  "https://icons.getbootstrap.com/assets/icons/capsule.svg",
                imagePadding: {
                  top: 1,
                  right: 1,
                  bottom: 1,
                  left: 1,
                },
              },
            },
          },
        );
      network?.fit();
    }
  }, [visJsRef, nodes, edges]);
  return (
    <div id="vis-panel" className="relative rounded-lg">
      <div
        ref={visJsRef}
        style={{ height: "78vh", width: "100%" }}
        className="w-full h-full absolute
                z-0
                rounded-lg
                border-2 border-solid
                border-purple-700
                left-0 right-0 top-0 bottom-0"
      />
      <div
        id="vis-toolbar"
        className="absolute right-0 top-0 
                    flex flex-col
                    z-10
                    space-y-2"
      >
        <button
          className="rounded-lg
                    p-3
                    self-end
                    w-fit
                    text-black leading-5 font-semibold
                    bg-emerald-400 hover:bg-emerald-600"
          onClick={(e) => {
            e.preventDefault();
            setOpenToolBar(!openToolBar);
          }}
        >
          Toolbar
        </button>
        <div
          className={`origin-top-right transition
                    bg-sky-800 rounded-lg
                    self-end
                    w-[20vw]
                    ${
                      openToolBar ? "p-5 h-[60vh] scale-100" : "p-0 h-0 scale-0"
                    }`}
        ></div>
      </div>
    </div>
  );
}
