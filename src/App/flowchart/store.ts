import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType
} from "@xyflow/react";
import { create } from "zustand";
import { NodeData } from "./types";
import { nanoid } from "nanoid";

export const addEndMarker = (edge: Edge) => ({
  ...edge,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#b1b1b7"
  }
});

export type RFState = {
  mindmap: any;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (params: any) => void;
  addNode: (node: Node) => void;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void;
  deleteNode: () => void;
  deleteEdge: (edgeId: string) => void;
  editingNode: string | null;
  setEditingNode: (nodeId: string | null) => void;
  updateNode: (data: Partial<NodeData>) => void;
  duplicateNode: () => void;
  moveNode: ({ down, right }: { down?: number; right?: number }) => void;
  downloading: boolean;
  toggleDownloading: (downloading: boolean) => void;
};

const useStore = create<RFState>((set, get) => ({
  selectedNode: null,
  setSelectedNode: (nodeId: string | null) => {
    set({ selectedNode: nodeId, editingNode: null });
  },
  mindmap: {
    edges: [],
    nodes: [
      {
        id: "1",
        type: "flowChartNode",
        data: { label: "Node 1" },
        position: { x: 0, y: 0 }
      },
      {
        id: "2",
        type: "flowChartNode",
        data: { label: "Node 2" },
        position: { x: 0, y: 100 }
      }
    ]
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
        nodes: applyNodeChanges(changes, mindmap.nodes)
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
        edges: applyEdgeChanges(changes, mindmap.edges)
      }
    });
  },
  onConnect: (params: any) => {
    set((state) => ({
      mindmap: {
        ...state.mindmap,
        edges: addEdge(addEndMarker({ ...params, type: "buttonEdge" }), state.mindmap.edges)
      }
    }));
  },
  addNode: (node: Node) => {
    set((state) => ({
      mindmap: {
        ...state.mindmap,
        nodes: [...state.mindmap.nodes, node]
      }
    }));
  },
  deleteNode: () => {
    const selectedNode = get().selectedNode;
    if (!selectedNode) {
      return;
    }

    set((state) => ({
      mindmap: {
        ...state.mindmap,
        nodes: state.mindmap.nodes.filter((n: Node) => n.id !== selectedNode)
      },
      selectedNode: null
    }));
  },
  deleteEdge: (edgeId: string) => {
    set((state) => ({
      mindmap: { ...state.mindmap, edges: state.mindmap.edges.filter((e: Edge) => e.id !== edgeId) }
    }));
  },
  editingNode: null,
  setEditingNode: (nodeId: string | null) => {
    set({ editingNode: nodeId });
  },
  updateNode: (data: Partial<NodeData>) => {
    set((state) => ({
      mindmap: {
        ...state.mindmap,
        nodes: state.mindmap.nodes.map((n: Node) => (n.id === state.selectedNode ? { ...n, data } : n))
      }
    }));
  },
  duplicateNode: () => {
    const node = get().mindmap.nodes.find((n: Node) => n.id === get().selectedNode);
    if (!node) {
      return;
    }

    const newNode = {
      id: nanoid(),
      type: node.type,
      data: { ...node.data },
      position: { x: node.position.x + 30, y: node.position.y + 30 }
    };

    get().addNode(newNode);

    set({ selectedNode: newNode.id });
  },
  moveNode: ({ down, right }: { up?: number; down?: number; left?: number; right?: number }) => {
    const node = get().mindmap.nodes.find((n: Node) => n.id === get().selectedNode);
    if (!node) {
      return;
    }

    set((state) => ({
      mindmap: {
        ...state.mindmap,
        nodes: state.mindmap.nodes.map((n: Node) =>
          n.id === node.id ? { ...n, position: { x: n.position.x + (right || 0), y: n.position.y + (down || 0) } } : n
        )
      }
    }));
  },
  downloading: false,
  toggleDownloading: (downloading: boolean) => {
    set({ downloading });
  }
}));

export default useStore;
