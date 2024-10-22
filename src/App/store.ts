import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition
} from "reactflow";
import create from "zustand";
import { nanoid } from "nanoid/non-secure";
import { NodeData } from "./types";

export type RFState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: Node | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeLabel: (nodeId: string, label: string) => void;
  addChildNode: (parentNode: Node, position: XYPosition) => Node;
  updateSelectedNode: (nodeId: string) => void;
};

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: "root",
      type: "mindmap",
      data: { label: "React Flow Mind Map" },
      position: { x: 0, y: 0 }
    }
  ],
  edges: [],
  selectedNode: null,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    });
  },
  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          node.data = { ...node.data, label };
        }

        return node;
      })
    });
  },
  updateSelectedNode: (nodeId: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node = { ...node, selected: true };
        } else {
          node = { ...node, selected: false };
        }

        set({ selectedNode: node });

        return node;
      })
    });
  },
  addChildNode: (parentNode: Node, position: XYPosition) => {
    const newNode = {
      id: nanoid(),
      type: "mindmap",
      data: { label: "New Node" },
      position,
      parentNode: parentNode.id
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id
    };

    set((state) => {
      const parentIndex = state.nodes.findIndex((node) => node.id === parentNode.id);
      const updatedNodes = [...state.nodes.slice(0, parentIndex + 1), newNode, ...state.nodes.slice(parentIndex + 1)];

      const updatedEdges = [...state.edges, newEdge];

      return {
        nodes: updatedNodes,
        edges: updatedEdges
      };
    });

    setTimeout(() => {
      console.log(get().nodes);
    }, 500);

    return newNode;
  }
}));

export default useStore;
