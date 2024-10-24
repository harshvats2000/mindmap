import { RFState } from "./store";

export type NodeData = {
  label: string;
};

export const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  updateSelectedNode: state.updateSelectedNode,
  updateNodeLabel: state.updateNodeLabel,
  selectedNode: state.selectedNode,
  addNodeOnTab: state.addNodeOnTab
});
