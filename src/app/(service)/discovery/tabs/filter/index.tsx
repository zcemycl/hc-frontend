"use client";
import { GraphTabEnum } from "@/constants";
import { DiscoveryContext } from "@/contexts";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { switch_color_node, switch_hover_color_node } from "../../utils";
import { INode } from "@/types";
import { useSearchParams } from "next/navigation";
import { useDiscoveryGraph } from "@/hooks";
import { ToggleBtnList } from "./toggle-btn-list";
import { SearchFilter } from "./search-filter";
import { NoFilterTextBox } from "./no-filter-text-box";
import { SideCopyBtn } from "./side-copy-btn";
import { PaginationBar2 } from "@/components";

export default function FilterTab() {
  const { tab, visJsRef, net, nodes, term, setTerm, setMultiSelectNodes } =
    useContext(DiscoveryContext);
  const { move_network, trace_node_callback } = useDiscoveryGraph();
  const [pageN, setPageN] = useState(0);
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [toggleNodeTypeList, setToggleNodeTypeList] = useState(["p"]);
  const nPerPage = 5;

  const filterNodesByTypeAndTerm = useMemo(() => {
    return nodes
      .filter((v: INode) => v["label"].toLowerCase().trim().includes(term))
      .filter((v: INode) => toggleNodeTypeList.includes(v.group as string));
  }, [term, toggleNodeTypeList, nodes, net]);

  const filterNodesByTypeAndTermNumber = useMemo(() => {
    return filterNodesByTypeAndTerm.length;
  }, [filterNodesByTypeAndTerm]);

  const filterNodes = useMemo(() => {
    return filterNodesByTypeAndTerm.slice(
      pageN * nPerPage,
      (pageN + 1) * nPerPage,
    );
  }, [filterNodesByTypeAndTerm, pageN]);

  useEffect(() => {
    setPageN(0);
  }, [filterNodesByTypeAndTermNumber]);

  return (
    <div
      className={`absolute
                left-0 right-0 top-0 bottom-0
                self-end
                space-y-2
                overflow-y-auto
                w-full h-full
                transition
                p-5
                ${
                  tab === GraphTabEnum.filters
                    ? "opacity-100 z-10 delay-200"
                    : "opacity-0 z-0 duration-200"
                }
                `}
    >
      <h2 className="leading text-slate-300 font-bold">Filters</h2>
      <div className="flex flex-row space-x-2">
        <ToggleBtnList
          defaultSelectedKeys={toggleNodeTypeList}
          toggleOptions={[
            {
              key: "p",
              displayName: "Drug",
            },
            {
              key: "ta",
              displayName: "Therapeutic Area",
            },
          ]}
          clickCallBack={(key: string) => {
            if (toggleNodeTypeList.includes(key)) {
              setToggleNodeTypeList((prev) => prev.filter((v) => v != key));
            } else {
              setToggleNodeTypeList((prev) => [...prev, key]);
            }
          }}
        />
      </div>

      <div
        className="flex flex-col space-y-1
                justify-between
                p-2 rounded-lg
                content-center align-middle items-center
                bg-amber-500
                "
      >
        <SearchFilter
          {...{
            term,
            setTerm,
          }}
        />
      </div>
      <hr className="mb-2" />
      <PaginationBar2
        topN={filterNodesByTypeAndTermNumber}
        pageN={pageN}
        nPerPage={nPerPage}
        setPageN={setPageN}
        maxVisible={7}
      />

      {filterNodes.length !== 0 ? (
        filterNodes.map((v: INode) => {
          return (
            <div
              ref={
                searchParams.has("product_name") &&
                v["label"].toLowerCase().trim() === term
                  ? buttonRef
                  : undefined
              }
              className={`text-black
                rounded-lg p-2 cursor-pointer
                ${switch_hover_color_node(v.group!)}
                ${switch_color_node(v.group!)}`}
              key={v.id}
              onClick={(e) => {
                e.preventDefault();
                if (visJsRef.current) {
                  try {
                    // net.releaseNode();
                    const targetNodeId = filterNodes.filter(
                      (x: INode) => x.id === v.id,
                    )[0].id;
                    move_network(net, targetNodeId);
                    net.selectNodes([targetNodeId]);
                    setMultiSelectNodes(
                      nodes.filter((v_: INode) => v_.id == v.id),
                    );
                    trace_node_callback(targetNodeId, net);
                  } catch (err) {}
                }
              }}
            >
              <p
                className="font-bold
                    items-center content-center align-middle"
              >
                Level {v.level}: <span id={`label-${v.id}`}>{v.label} </span>
                <SideCopyBtn v={v} />
              </p>
            </div>
          );
        })
      ) : (
        <NoFilterTextBox />
      )}
    </div>
  );
}
