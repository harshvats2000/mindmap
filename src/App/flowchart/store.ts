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
};

const useStore = create<RFState>((set, get) => ({
  mindmap: {
    edges: [],
    nodes: [
      {
        id: "1",
        data: { label: "harsh" },
        type: "flowChartNode",
        position: { x: 0, y: 0 }
      },
      {
        id: "2",
        data: { label: "dushy" },
        type: "flowChartNode",
        position: { x: 0, y: 100 }
      },
      {
        id: "3",
        data: { label: "guru" },
        type: "flowChartNode",
        position: { x: 0, y: 200 }
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
    console.log(params);
    set((state) => ({
      mindmap: {
        ...state.mindmap,
        edges: addEdge(addEndMarker(params), state.mindmap.edges)
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
  }
}));

export default useStore;
