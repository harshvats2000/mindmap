import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges
} from "@xyflow/react";
import { create } from "zustand";
import { IMindmap, NodeData } from "./types";
import { User } from "firebase/auth";
import { updateDoc, doc, getDoc, Timestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { nanoid } from "nanoid";
import {
  findFirstChildNode,
  findNextNodeInSameColumn,
  findParentNodeId,
  findPreviousNodeInSameColumn,
  findPreviousSibling,
  getLayoutedElements
} from "./helpers";

export type RFState = {
  selectedNode: Node | null;
  setSelectedNode: (nodeId: string | null) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateSelectedNode: (nodeId: string) => void;
  addChildNode: () => void;
  bgColor: string;
  updateBgColor: (color: string) => void;
  deleteNodeAndChildren: () => void;
  isActionButtonVisible: boolean;
  toggleActionButton: () => void;
  isAuthenticating: boolean;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  saveMindmap: () => Promise<void>;
  loadMindmap: (mindmapId: string) => Promise<void>;
  createMindmap: () => Promise<string>;
  mindmap: IMindmap | null;
  isFetchingMindmap: boolean;
  setIsFetchingMindmap: (isFetchingMindmap: boolean) => void;
  isSavingMindmap: boolean;
  numberONodes: number;
  addSiblingNode: () => void;
  selectPreviousSibling: () => void;
  selectPreviousNodeInSameColumn: () => void;
  selectNextNodeInSameColumn: () => void;
  selectParentNode: () => void;
  selectFirstChildNode: () => void;
  editingNode: string | null;
  setEditingNode: (nodeId: string | null) => void;
};

const useStore = create<RFState>((set, get) => ({
  numberONodes: 1,
  selectedNode: null,
  setSelectedNode: (nodeId: string | null) => {
    set({ selectedNode: get().mindmap?.nodes.find((node) => node.id === nodeId) || null });
  },
  bgColor: "#1a365d",
  isActionButtonVisible: true,
  toggleActionButton: () => {
    set({ isActionButtonVisible: !get().isActionButtonVisible });
  },
  updateBgColor: (color: string) => {
    set({ bgColor: color });
    const mindmap = get().mindmap;
    if (!mindmap) {
      console.error("Mindmap not found");
      return;
    }

    const mindmapData = {
      bgColor: color,
      updatedAt: Timestamp.fromDate(new Date())
    };

    updateDoc(doc(db, "mindmaps", mindmap.id), mindmapData);
  },
  onNodesChange: (changes: NodeChange[]) => {
    const mindmap = get().mindmap;
    if (!mindmap) {
      console.error("Mindmap not found");
      return;
    }

    set({
      mindmap: {
        ...mindmap,
        nodes: getLayoutedElements(applyNodeChanges(changes, mindmap.nodes) as Node<NodeData>[], mindmap.edges)
          .nodes as Node<NodeData>[]
      }
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    const mindmap = get().mindmap;
    if (!mindmap) {
      console.error("Mindmap not found");
      return;
    }

    set({
      mindmap: {
        ...mindmap,
        edges: getLayoutedElements(mindmap.nodes, applyEdgeChanges(changes, mindmap.edges)).edges as Edge[]
      }
    });
  },
  updateNodeLabel: (nodeId: string, label: string) => {
    const mindmap = get().mindmap;
    if (!mindmap) {
      console.error("Mindmap not found");
      return;
    }
    set({
      mindmap: {
        ...mindmap,
        nodes: mindmap.nodes.map((node) => {
          if (node.id === nodeId) {
            // Update the label in the existing node's data
            node.data.label = label;
          }
          return node;
        })
      }
    });
  },
  updateSelectedNode: (nodeId: string) => {
    set({
      selectedNode: get().mindmap?.nodes.find((node) => node.id === nodeId) || null
    });
  },
  addChildNode: () => {
    const id = get().selectedNode?.id!;
    if (!id) return;

    const mindmap = get().mindmap;
    if (!mindmap) {
      console.error("Mindmap not found");
      return;
    }
    const node = mindmap.nodes.find((node) => node.id === id);
    const newNodeId = `node-${mindmap.nodes.length + 1}`;
    const newNodeLabel = `Node ${mindmap.nodes.length + 1}`;
    const newNode: Node = {
      id: newNodeId,
      data: { label: newNodeLabel },
      position: { x: 0, y: 0 },
      type: "textUpdater"
    };

    const newEdge = {
      id: `edge-${mindmap.edges.length + 1}`,
      source: node?.id,
      target: newNode.id,
      type: "smoothstep",
      animated: true
      // style: {
      //   strokeWidth: 2,
      //   stroke: "#FF0072"
      // }
    };

    const updatedNodes = [...mindmap.nodes, newNode];
    const updatedEdges = [...mindmap.edges, newEdge];

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      updatedNodes as Node<NodeData>[],
      updatedEdges as Edge[]
    );

    set({
      mindmap: {
        ...mindmap,
        nodes: layoutedNodes as Node<NodeData>[],
        edges: layoutedEdges as Edge[]
      },
      numberONodes: layoutedNodes.length
    });

    get().updateSelectedNode(newNode.id);
  },
  deleteNodeAndChildren: () => {
    const nodeId = get().selectedNode?.id;
    if (!nodeId || nodeId === "root") return;
    const nodesToDelete = new Set<string>();
    const edgesToDelete = new Set<string>();
    const mindmap = get().mindmap!;

    const traverseAndMarkForDeletion = (currentNodeId: string) => {
      nodesToDelete.add(currentNodeId);
      mindmap.edges.forEach((edge) => {
        if (edge.source === currentNodeId) {
          edgesToDelete.add(edge.id);
          traverseAndMarkForDeletion(edge.target);
        }
      });
    };

    traverseAndMarkForDeletion(nodeId);

    const nextNode = findNextNodeInSameColumn(mindmap.nodes as Node<NodeData>[], nodeId);
    const previousNode = findPreviousNodeInSameColumn(mindmap.nodes as Node<NodeData>[], nodeId);
    if (nextNode) {
      get().updateSelectedNode(nextNode);
    } else if (previousNode) {
      get().updateSelectedNode(previousNode);
    } else if (findParentNodeId(mindmap.edges, nodeId)) {
      get().selectParentNode();
    }

    const updatedNodes = mindmap.nodes.filter((node) => !nodesToDelete.has(node.id));

    // Recreate edges based on the remaining nodes
    const updatedEdges = mindmap.edges
      .filter(
        (edge) => !edgesToDelete.has(edge.id) && !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
      )
      .map((edge) => ({
        ...edge,
        id: `edge-${Math.random().toString(36).substr(2, 9)}`
      }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      updatedNodes as Node<NodeData>[],
      updatedEdges as Edge[]
    );

    set({
      mindmap: {
        ...mindmap,
        nodes: layoutedNodes as Node<NodeData>[],
        edges: layoutedEdges as Edge[]
      },
      numberONodes: layoutedNodes.length
    });
  },
  user: null,
  isAuthenticating: true,
  setIsAuthenticating: (isAuthenticating: boolean) => set({ isAuthenticating }),
  setUser: (user: User | null) => set({ user }),
  saveMindmap: async () => {
    set({ isSavingMindmap: true });
    const { mindmap } = get();
    if (!mindmap) {
      console.error("Mindmap not found");
      return;
    }

    const mindmapData = {
      ...mindmap,
      updatedAt: Timestamp.fromDate(new Date())
    };

    try {
      await updateDoc(doc(db, "mindmaps", mindmap.id), mindmapData);
    } catch (error) {
      console.error("Error saving mindmap: ", error);
    } finally {
      set({ isSavingMindmap: false });
    }
  },
  loadMindmap: async (mindmapId: string) => {
    try {
      const docRef = doc(db, "mindmaps", mindmapId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          mindmap: data as IMindmap,
          bgColor: data?.bgColor || get().bgColor,
          numberONodes: data?.nodes?.length || 1
        });
      } else {
        console.log("No such mindmap!");
      }
    } catch (error) {
      console.error("Error loading mindmap: ", error);
    }
  },
  mindmap: null,
  isSavingMindmap: false,
  createMindmap: async () => {
    const { user } = get();
    if (!user) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    const initialNode: Node<NodeData> = {
      id: "root",
      type: "textUpdater",
      data: { label: "New Mindmap" },
      position: { x: 0, y: 0 }
    };

    const newMindmap: IMindmap = {
      id: nanoid(),
      title: "Untitled Mindmap",
      nodes: [initialNode],
      edges: [],
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    };

    try {
      await setDoc(doc(db, "mindmaps", newMindmap.id), newMindmap);

      set({
        mindmap: { ...newMindmap, id: newMindmap.id },
        numberONodes: 1
      });

      return newMindmap.id;
    } catch (error) {
      console.error("Error creating mindmap: ", error);
      throw error;
    }
  },
  isFetchingMindmap: false,
  setIsFetchingMindmap: (isFetchingMindmap: boolean) => set({ isFetchingMindmap }),
  addSiblingNode: () => {
    const id = get().selectedNode?.id!;
    if (!id || id === "root") return;
    const mindmap = get().mindmap!;

    const newNodeId = `node-${mindmap.nodes.length + 1}`;
    const newNodeLabel = `Node ${mindmap.nodes.length + 1}`;
    const newNode: Node = {
      id: newNodeId,
      data: { label: newNodeLabel },
      position: { x: 0, y: 0 },
      type: "textUpdater"
    };

    const newEdge: Edge = {
      id: `edge-${mindmap.edges.length + 1}`,
      source: findParentNodeId(mindmap.edges, id)!,
      target: newNode.id,
      type: "smoothstep",
      animated: true
    };

    const edgeIndex = mindmap.edges.findIndex((edge) => edge.target === id);
    const nodeIndex = mindmap.nodes.findIndex((node) => node.id === id);
    const updatedNodes = [...mindmap.nodes.slice(0, nodeIndex + 1), newNode, ...mindmap.nodes.slice(nodeIndex + 1)];
    const updatedEdges = [...mindmap.edges.slice(0, edgeIndex + 1), newEdge, ...mindmap.edges.slice(edgeIndex + 1)];

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      updatedNodes as Node<NodeData>[],
      updatedEdges
    );

    set({
      mindmap: {
        ...mindmap,
        nodes: layoutedNodes as Node<NodeData>[],
        edges: layoutedEdges
      },
      numberONodes: layoutedNodes.length
    });

    get().updateSelectedNode(newNode.id);
  },
  selectPreviousSibling: () => {
    const id = get().selectedNode?.id!;
    const previousSibling = findPreviousSibling(get().mindmap!, id);
    if (previousSibling) {
      get().updateSelectedNode(previousSibling);
    }
  },
  selectPreviousNodeInSameColumn: () => {
    const id = get().selectedNode?.id!;
    const previousNode = findPreviousNodeInSameColumn(get().mindmap!.nodes, id);
    if (previousNode) {
      get().updateSelectedNode(previousNode);
    }
  },
  selectNextNodeInSameColumn: () => {
    const id = get().selectedNode?.id!;
    const nextNode = findNextNodeInSameColumn(get().mindmap!.nodes, id);
    if (nextNode) {
      get().updateSelectedNode(nextNode);
    }
  },
  selectParentNode: () => {
    const id = get().selectedNode?.id!;
    const parentNode = findParentNodeId(get().mindmap!.edges, id);
    if (parentNode) {
      get().updateSelectedNode(parentNode);
    }
  },
  selectFirstChildNode: () => {
    const id = get().selectedNode?.id!;
    const firstChild = findFirstChildNode(get().mindmap!, id);
    if (firstChild) {
      get().updateSelectedNode(firstChild);
    }
  },
  editingNode: null,
  setEditingNode: (nodeId: string | null) => {
    set({ editingNode: nodeId });
  }
}));

// After creating the store, set the initial selected node
useStore.setState((state) => ({
  selectedNode: state.mindmap?.nodes[0] || null
}));

export default useStore;
