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
  addChildNode: () => void;
  updateSelectedNode: (nodeId: string) => void;
  deleteNode: () => void;
};

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: "root",
      type: "mindmap",
      data: { label: "React Flow Mind Map" },
      position: { x: 0, y: 0 }
    }
    // {
    //   id: "child1",
    //   type: "mindmap",
    //   data: { label: "React Flow Mind Map" },
    //   position: { x: 300, y: 0 }
    // },
    // {
    //   id: "child2",
    //   type: "mindmap",
    //   data: { label: "React Flow Mind Map" },
    //   position: { x: 300, y: 300 }
    // }
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
      selectedNode: get().nodes.find((node) => node.id === nodeId)
    });
  },
  addChildNode: () => {
    const parentNode = get().selectedNode!;
    const existingChildren = get().nodes.filter((node) => node.parentNode === parentNode.id);
    const childCount = existingChildren.length;

    const newNode: Node = {
      id: nanoid(),
      type: "mindmap",
      data: { label: `Node ${get().nodes.length}` },
      position: { x: parentNode.width! + 100, y: 22 + childCount * 50 },
      parentNode: parentNode.id
    };

    const newEdge: Edge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id
    };

    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.parentNode === parentNode.id) {
          // Move existing children up
          return { ...node, position: { x: node.position.x, y: node.position.y - 50 } };
        }
        return node;
      });

      return {
        nodes: [...updatedNodes, newNode],
        edges: [...state.edges, newEdge]
      };
    });
  },
  deleteNode: () => {
    set({
      nodes: get().nodes.filter((node) => node.id !== get().selectedNode?.id)
    });
  }
}));

export default useStore;
