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
  addNode: state.addNode,
  bgColor: state.bgColor,
  updateBgColor: state.updateBgColor,
  deleteNodeAndChildren: state.deleteNodeAndChildren,
  isActionButtonVisible: state.isActionButtonVisible,
  toggleActionButton: state.toggleActionButton,
  user: state.user,
  setUser: state.setUser
});
