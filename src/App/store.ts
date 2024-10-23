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
  addChildNode: (parentNode: Node) => Node;
  updateSelectedNode: (nodeId: string) => void;
};

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: "root",
      type: "mindmap",
      data: { label: "React Flow Mind Map" },
      position: { x: 0, y: 0 },
      height: 100
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
  addChildNode: (parentNode: Node) => {
    const existingChildren = get().nodes.filter((node) => node.parentNode === parentNode.id);
    const childCount = existingChildren.length;

    const newNode: Node = {
      id: nanoid(),
      type: "mindmap",
      data: { label: `Node ${get().nodes.length}` },
      position: { x: parentNode.width! + 100, y: 22 + childCount * 75 },
      parentNode: parentNode.id,
      height: 100
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
          return { ...node, position: { ...node.position, y: node.position.y - 75 } };
        }
        return node;
      });

      return {
        nodes: [...updatedNodes, newNode],
        edges: [...state.edges, newEdge],
        selectedNode: newNode
      };
    });

    return newNode;
  }
}));

export default useStore;
