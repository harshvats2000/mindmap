import { Edge, Node } from "@xyflow/react";
import { RFState } from "./store";

export type NodeData = {
  label: string;
};

export type Mindmap = {
  nodes: Node[];
  edges: Edge[];
};

export const selector = (state: RFState) => ({
  mindmap: state.mindmap,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange
});
