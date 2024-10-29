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

export type RFState = {
  mindmap: any;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
};

const useStore = create<RFState>((set, get) => ({
  mindmap: {
    edges: [],
    nodes: [
      {
        id: "1",
        data: { label: "Hello" },
        type: "flowChartNode",
        position: { x: 0, y: 0 }
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
  }
}));

export default useStore;
