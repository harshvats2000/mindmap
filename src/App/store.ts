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
} from "@xyflow/react";
import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";
import { NodeData } from "./types";
import dagre from "@dagrejs/dagre";

const dagreGraph = new dagre.graphlib.Graph({ compound: false }).setDefaultEdgeLabel(() => ({}));

const nodeWidth = 150;
const nodeHeight = 1;

const getLayoutedElements = (nodes: Node<NodeData>[], edges: Edge[], direction = "LR") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

export type RFState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: Node | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateSelectedNode: (nodeId: string) => void;
  addNode: () => void;
};

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: "root",
      type: "textUpdater",
      data: { label: "Hello" },
      position: { x: 0, y: 0 }
    }
  ],
  edges: [],
  selectedNode: null, // Initialize as null
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: getLayoutedElements(applyNodeChanges(changes, get().nodes) as Node<NodeData>[], get().edges)
        .nodes as Node<NodeData>[]
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: getLayoutedElements(get().nodes, applyEdgeChanges(changes, get().edges)).edges as Edge[]
    });
  },
  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // Update the label in the existing node's data
          node.data.label = label;
        }
        return node;
      })
    });
  },
  updateSelectedNode: (nodeId: string) => {
    set({
      selectedNode: get().nodes.find((node) => node.id === nodeId) || null
    });
  },
  addNode: () => {
    if (get().selectedNode) {
      const newNodeId = `node-${get().nodes.length + 1}`;
      const newNodeLabel = `Node ${get().nodes.length + 1}`;
      const newNode: Node = {
        id: newNodeId,
        data: { label: newNodeLabel, onNodeLabelChange: get().updateNodeLabel },
        position: { x: 0, y: 0 },
        type: "textUpdater"
      };

      const newEdge = {
        id: `edge-${get().edges.length + 1}`,
        source: get().selectedNode?.id,
        target: newNode.id,
        type: "smoothstep",
        animated: true
      };

      const updatedNodes = [...get().nodes, newNode];
      const updatedEdges = [...get().edges, newEdge];

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        updatedNodes as Node<NodeData>[],
        updatedEdges as Edge[]
      );

      set({
        nodes: layoutedNodes as Node<NodeData>[],
        edges: layoutedEdges as Edge[]
      });

      get().updateSelectedNode(newNode.id);
    }
  }
}));

// After creating the store, set the initial selected node
useStore.setState((state) => ({
  selectedNode: state.nodes[0]
}));

export default useStore;
