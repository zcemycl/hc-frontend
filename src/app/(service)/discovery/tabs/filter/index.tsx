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
import { PaginationBar2, VisibilityBtn } from "@/components";

const toggleOptions = [
  {
    key: "p",
    displayName: "Drug",
  },
  {
    key: "ta",
    displayName: "Therapeutic Area",
  },
];

export default function FilterTab() {
  const {
    tab,
    visJsRef,
    net,
    nodes,
    term,
    setTerm,
    multiSelectNodes,
    setMultiSelectNodes,
    nPerPage,
    dNodes,
  } = useContext(DiscoveryContext);
  const { move_network, trace_node_callback } = useDiscoveryGraph();
  const [pageN, setPageN] = useState(0);
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [toggleNodeTypeList, setToggleNodeTypeList] = useState(["p"]);
  const [hiddenAll, setHiddenAll] = useState<boolean>(false);
  const [hiddenType, setHiddenType] = useState<boolean[]>(
    toggleOptions.map((v) => false),
  );

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
      <div className="flex flex-row justify-start space-x-2">
        <h2 className="leading text-slate-300 font-bold">Filters</h2>
        <button
          className={`bg-teal-700 hover:bg-teal-300
            ${
              hiddenAll
                ? "bg-teal-700 hover:bg-teal-300"
                : "bg-teal-300 hover:bg-teal-700"
            }
          text-black font-bold
          py-0 px-2 rounded-lg
          flex flex-row space-x-2 content-center items-center align-middle`}
          onClick={(e) => {
            e.preventDefault();
            dNodes.map((dn: any) => {
              dNodes.update({ id: dn.id, hidden: !hiddenAll });
            });
            setHiddenType(toggleOptions.map((_) => !hiddenAll));
            setHiddenAll((prev) => !prev);
          }}
        >
          <VisibilityBtn
            {...{
              isHidden: hiddenAll,
              isShowText: true,
            }}
          />
        </button>
      </div>
      <div className="flex flex-row space-x-2">
        <ToggleBtnList
          visibility={hiddenType}
          defaultSelectedKeys={toggleNodeTypeList}
          toggleOptions={toggleOptions}
          clickCallBack={(key: string) => {
            if (toggleNodeTypeList.includes(key)) {
              setToggleNodeTypeList((prev) => prev.filter((v) => v != key));
            } else {
              setToggleNodeTypeList((prev) => [...prev, key]);
            }
          }}
          visibilityCallback={(i: number, key: string) => {
            dNodes.map((dn: any) => {
              if (dn.group !== key) return;
              dNodes.update({ id: dn.id, hidden: !hiddenType[i] });
            });
            setHiddenType((prev: boolean[]) => {
              let prev_copy = [...prev];
              prev_copy[i] = !prev_copy[i];
              return prev_copy;
            });
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
                    const targetNodeId = v.id;
                    console.log(multiSelectNodes, targetNodeId);
                    // move_network(net, targetNodeId);
                    // trace_node_callback(targetNodeId, net);
                    let _nodes: INode[];
                    if (!e.ctrlKey) {
                      _nodes = [v];
                    } else {
                      if (
                        multiSelectNodes.some(
                          (v_: INode) => v_.id === targetNodeId,
                        )
                      ) {
                        // ctrl + existing node = delete
                        _nodes = multiSelectNodes.filter(
                          (n: INode) => n.id !== targetNodeId,
                        );
                      } else {
                        // ctrl + non selected node = add
                        _nodes = [...multiSelectNodes, v];
                      }
                    }
                    const _nodes_ids = _nodes.map((n: INode) => n.id);
                    net.selectNodes(_nodes_ids);
                    setMultiSelectNodes(_nodes);
                    if (_nodes_ids.length > 0) {
                      const tmpL = _nodes_ids.length;
                      move_network(net, _nodes_ids[tmpL - 1]);
                      trace_node_callback(_nodes_ids[tmpL - 1], net);
                    }
                  } catch (err) {}
                }
              }}
            >
              <p className="font-bold">
                Level {v.level}:{" "}
                <span id={`label-${v.id}`} className="inline">
                  {v.label}{" "}
                </span>
                <span className="inline-flex items-center space-x-1 align-middle">
                  <SideCopyBtn v={v} />
                  <VisibilityBtn isHidden={false} isShowText={false} />
                </span>
              </p>
            </div>
          );
        })
      ) : (
        <NoFilterTextBox />
      )}
      <PaginationBar2
        topN={filterNodesByTypeAndTermNumber}
        pageN={pageN}
        nPerPage={nPerPage}
        setPageN={setPageN}
        maxVisible={7}
      />
    </div>
  );
}
