import { RFState } from "./store";

export type NodeData = {
  label: string;
};

export const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  updateSelectedNode: state.updateSelectedNode,
  selectedNode: state.selectedNode,
  deleteNode: state.deleteNode
});
