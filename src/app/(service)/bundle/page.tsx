"use client";
import {
  CompositeCorner,
  ListPageTemplate,
  Modal,
  ProfileBar,
  ProtectedRoute,
  BundleFdalabelSubItem,
} from "@/components";
import { BundleAnnotationSubItem } from "@/components/button/bundle-annotation-subitem";
import {
  AnnotationTypeEnum,
  GraphDirectionEnum,
  GraphTypeEnum,
} from "@/constants";
import {
  DiscoveryContext,
  FdaVersionsContext,
  useAuth,
  useLoader,
} from "@/contexts";
import { useApiHandler } from "@/hooks";
import {
  fetchAnnotateSourcev2,
  fetchBundleByIdv2,
  patchBundleByIdv2,
} from "@/http/backend";
import {
  AnnotationCategoryEnum,
  IAnnotationRef,
  IAnnotationSourceMap,
  IBundle,
  IEdge,
  IFdaLabelRef,
  IFlagAttrs,
  INode,
  IUserRef,
  UserRoleEnum,
} from "@/types";
import { Plus, SendHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnnotationContent } from "./annotation-content";
import { FdalabelContent } from "./fdalabel-content";
import { Network } from "vis-network";
import { confirm_bundle_purpose } from "@/utils";

export default function Page() {
  const searchParams = useSearchParams();
  const bundle_id = searchParams.get("id");
  const [bundle, setBundle] = useState<IBundle | null>(null);
  const { withLoading } = useLoader();
  const { handleResponse } = useApiHandler();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const { userData } = useAuth();
  const router = useRouter();
  const { versions } = useContext(FdaVersionsContext);
  const [annSource, setAnnSource] = useState<IAnnotationSourceMap>({});

  const visJsRef = useRef<HTMLDivElement>(null);
  const visToolBarRef = useRef<HTMLDivElement>(null);
  const [net, setNet] = useState<Network | null>(null);
  // node path to drug
  const [path, setPath] = useState<string[]>([]);
  // all nodes and edges from fetch graph
  const [nodes, setNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);
  const [dNodes, setDNodes] = useState<any>(null);
  const [dEdges, setDEdges] = useState<any>(null);
  // for info tab displaying chain
  const [selectedNodes, setSelectedNodes] = useState<INode[]>([]);
  // for multi select nodes for drugs
  const [multiSelectNodes, setMultiSelectNodes] = useState<INode[]>([]);
  // for flag tab, including ta names, max no of nodes, etc.
  const [flagAttrs, setFlagAttrs] = useState<IFlagAttrs>({
    name: searchParams.get("therapeutic_area") ?? "Neoplasms",
    numNodes: 100,
    offset: 0,
    maxLevel: 6,
  });
  // for settings tab
  const [settings, defineSettings] = useState<any>({
    graph_type: GraphTypeEnum.radial,
    graph_direction: GraphDirectionEnum.leftright,
    enabled_physics: true,
    physics_stabilisation: true,
  });

  const getData = useCallback(async () => {
    const resBundle = await withLoading(() =>
      fetchBundleByIdv2(bundle_id as string),
    );
    console.log(resBundle);
    if (!resBundle.success) handleResponse(resBundle);
    setBundle(resBundle.data || null);
    const ann_ids = resBundle.data.annotations.map((v: IAnnotationRef) => v.id);
    if (ann_ids.length === 0) return;
    const restmp = await withLoading(() =>
      fetchAnnotateSourcev2(ann_ids, versions),
    );
    if (!restmp.success) handleResponse(restmp);
    setAnnSource((prev: IAnnotationSourceMap) => {
      return {
        ...restmp.data,
        ...prev,
      };
    });
    console.log(restmp);
  }, [bundle_id]);

  useEffect(() => {
    getData();
    console.log(userData);
  }, [bundle_id]);

  const useFor = useMemo<string>(() => {
    return confirm_bundle_purpose(bundle as IBundle);
  }, [bundle]);

  const allWords = useMemo(() => {
    const words_: string[] = [];
    Object.keys(annSource).forEach((k: string) => {
      words_.push(annSource[k].adverse_effect_table?.caption as string);
    });
    const final = words_
      .join(" ")
      .replace("\n", " ")
      .replace("-", " ")
      .replace(/[-–—−]/g, " ")
      .replace(/\s+/g, " ") // normalize multiple spaces
      .trim();
    return final;
  }, [annSource]);

  return (
    <ProtectedRoute>
      <DiscoveryContext.Provider
        value={{
          dNodes,
          setDNodes,
          nodes,
          setNodes,
          dEdges,
          setDEdges,
          edges,
          setEdges,
          path,
          setPath,
          selectedNodes,
          setSelectedNodes,
          multiSelectNodes,
          setMultiSelectNodes,
          settings,
          defineSettings,
          net,
          setNet,
          flagAttrs,
          setFlagAttrs,
          visJsRef,
          visToolBarRef,
        }}
      >
        <ListPageTemplate>
          <ProfileBar title={`Bundle ${bundle?.name || ""}`} />
          <hr className="mb-2" />
          <div id="basic-bundle-content" className="flex flex-col space-y-2">
            <div
              className="flex flex-row justify-start space-x-2
            select-text"
            >
              <span>Reference: </span>
              <span
                className="bg-amber-300 rounded-lg px-3 
            text-black flex-shrink-0 whitespace-nowrap
            font-semibold"
              >
                <CompositeCorner
                  {...{
                    label: bundle?.id as string,
                    click_callback: () => {},
                    enable_copy: true,
                  }}
                />
              </span>
            </div>
            <div className="flex flex-row justify-start space-x-2">
              <span>Category: </span>
              <span
                className="bg-amber-300 rounded-lg px-3 
            text-black flex-shrink-0 whitespace-nowrap
            font-semibold"
              >
                {useFor}
              </span>
            </div>
            {bundle?.description !== "" && (
              <div className="flex flex-row justify-start space-x-2">
                Description: {bundle?.description}
              </div>
            )}
            {bundle?.users.length !== 0 && (
              <div
                className="flex flex-row justify-start space-x-2
                flex-wrap items-center"
              >
                <span>Owners: </span>
                {bundle?.users.map((u: IUserRef) => {
                  const myRole2Bundle = bundle?.user_links?.find(
                    (link) => link.user_id === userData.id,
                  )?.role;
                  const curEmailRole2Bundle = bundle?.user_links?.find(
                    (link) => link.user_id === u.id,
                  )?.role;
                  // curEmailRole = ADMIN -> false else true to prevent creator of bundle
                  // cmyRole2Bundle = USER -> false else true to prevent user of bundle to delete
                  let isHidden = false;
                  isHidden = curEmailRole2Bundle === UserRoleEnum.ADMIN;
                  if (myRole2Bundle === UserRoleEnum.USER) isHidden = true;
                  return (
                    <div
                      className="px-2 bg-emerald-400
                        rounded-lg font-semibold text-black"
                      key={`bundle-user-${u.email}`}
                    >
                      <CompositeCorner
                        {...{
                          label: u.email,
                          click_callback: () => {},
                          del_callback: isHidden
                            ? undefined
                            : async () => {
                                const emailsAfterDel = bundle?.users
                                  .filter((em) => em.email !== u.email)
                                  .map((em) => em.email);
                                const patchBundleResult = await withLoading(
                                  () =>
                                    patchBundleByIdv2(
                                      bundle?.id as string,
                                      {
                                        emails: emailsAfterDel,
                                      },
                                      versions,
                                    ),
                                );
                                if (!patchBundleResult.success)
                                  handleResponse(patchBundleResult);
                                await getData();
                              },
                        }}
                      />
                    </div>
                  );
                })}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpenModal(true);
                  }}
                >
                  <Plus
                    className="
                  rounded-lg bg-sky-400
                  hover:bg-sky-700
                  text-black
                "
                  />
                </button>
              </div>
            )}
            {bundle?.fdalabels.length !== 0 && (
              <div
                className="flex flex-row justify-start gap-2
                flex-wrap"
              >
                <span>Drugs: </span>
                {bundle?.fdalabels.map((f: IFdaLabelRef) => (
                  <BundleFdalabelSubItem
                    key={`bundle-drug-${f.setid}`}
                    {...{
                      f,
                      fdaClickCallback: (s: string) => {
                        router.push(`/fdalabel?fdalabel_id=${s}`);
                      },
                      fdaDelCallback: async (s: string) => {
                        const fdaAfterDel = bundle.fdalabels
                          .filter((f_) => f_.id !== f.id)
                          .map((f_) => f_.tradename);
                        console.log(fdaAfterDel);
                        const patchBundleResult = await withLoading(() =>
                          patchBundleByIdv2(
                            bundle.id,
                            {
                              tradenames: fdaAfterDel,
                            },
                            versions,
                          ),
                        );
                        handleResponse(patchBundleResult);
                        if (!patchBundleResult.success) return;
                        await getData();
                      },
                    }}
                  />
                ))}
              </div>
            )}
            {bundle?.annotations.length !== 0 && (
              <div
                className="flex flex-row justify-start gap-2
                flex-wrap"
              >
                <span>Annotations: </span>
                {bundle?.annotations.map((ann: IAnnotationRef) => {
                  return (
                    <BundleAnnotationSubItem
                      key={`bundle-annotation-${ann.id}`}
                      {...{
                        ann,
                        annSource,
                        annotationClickCallback: (
                          setid: string,
                          category: AnnotationCategoryEnum,
                          table_id: number | string,
                        ) => {
                          router.push(
                            `/annotate/fdalabel/${setid}/${category}/${table_id}?tab=${AnnotationTypeEnum.COMPLETE}`,
                          );
                        },
                        annotationDelCallback: async () => {
                          const bundlesAfterDel = bundle.annotations
                            .filter((ann_) => ann_.id !== ann.id)
                            .map((ann_) => ann_.id);
                          console.log(bundlesAfterDel);
                          const patchBundleResult = await withLoading(() =>
                            patchBundleByIdv2(
                              bundle.id,
                              {
                                annotation_ids: bundlesAfterDel,
                              },
                              versions,
                            ),
                          );
                          handleResponse(patchBundleResult);
                          if (!patchBundleResult.success) return;
                          await getData();
                        },
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <Modal
            {...{
              title: "Add user by email",
              isOpenModal,
              setIsOpenModal,
            }}
          >
            <div
              className="flex flex-col space-y-2
                  px-2 sm:px-5
                  py-2 pb-5"
            >
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-white">Email Address</label>
                <input
                  type="text"
                  value={email}
                  className="bg-slate-300 text-black w-full
                          rounded-md p-2"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                  }}
                />
                <div className="flex flex-row justify-end">
                  <button
                    className="bg-emerald-300 hover:bg-emerald-500
                          rounded-lg flex flex-row justify-between
                          px-4 py-2 space-x-2
                          font-bold text-black"
                    onClick={async (e) => {
                      e.preventDefault();
                      const eSet = new Set();
                      bundle?.users.forEach((em) => eSet.add(em.email));
                      eSet.add(email);
                      const patchBundleResult = await withLoading(() =>
                        patchBundleByIdv2(
                          bundle?.id as string,
                          {
                            emails: Array.from(eSet) as string[],
                          },
                          versions,
                        ),
                      );
                      if (!patchBundleResult.success)
                        handleResponse(patchBundleResult);
                      await getData();
                      setEmail("");
                      setIsOpenModal(false);
                    }}
                  >
                    <SendHorizontal />
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <hr className="mb-2" />
          {bundle?.fdalabels.length !== 0 && (
            <FdalabelContent
              {...{
                bundle,
              }}
            />
          )}
          {bundle?.annotations.length !== 0 && (
            <AnnotationContent
              {...{
                allWords,
                annSource,
                bundle,
              }}
            />
          )}
        </ListPageTemplate>
      </DiscoveryContext.Provider>
    </ProtectedRoute>
  );
}
