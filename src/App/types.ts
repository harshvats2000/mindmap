import { Edge, Node } from "@xyflow/react";
import { RFState } from "./store";
import { Timestamp } from "firebase/firestore";
import { RFStatePlay } from "./store-play";

export type NodeData = {
  label: string;
};

export const selector = (state: RFState) => ({
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  updateSelectedNode: state.updateSelectedNode,
  updateNodeLabel: state.updateNodeLabel,
  selectedNode: state.selectedNode,
  addChildNode: state.addChildNode,
  bgColor: state.bgColor,
  updateBgColor: state.updateBgColor,
  deleteNodeAndChildren: state.deleteNodeAndChildren,
  isActionButtonVisible: state.isActionButtonVisible,
  toggleActionButton: state.toggleActionButton,
  user: state.user,
  setUser: state.setUser,
  saveMindmap: state.saveMindmap,
  loadMindmap: state.loadMindmap,
  createMindmap: state.createMindmap,
  mindmap: state.mindmap,
  isAuthenticating: state.isAuthenticating,
  setIsAuthenticating: state.setIsAuthenticating,
  isFetchingMindmap: state.isFetchingMindmap,
  setIsFetchingMindmap: state.setIsFetchingMindmap,
  setSelectedNode: state.setSelectedNode,
  isSavingMindmap: state.isSavingMindmap,
  numberONodes: state.numberONodes,
  addSiblingNode: state.addSiblingNode,
  selectPreviousSibling: state.selectPreviousSibling,
  selectPreviousNodeInSameColumn: state.selectPreviousNodeInSameColumn,
  selectNextNodeInSameColumn: state.selectNextNodeInSameColumn,
  selectParentNode: state.selectParentNode,
  selectFirstChildNode: state.selectFirstChildNode,
  editingNode: state.editingNode,
  setEditingNode: state.setEditingNode
});

export const selectorPlay = (state: RFStatePlay) => ({
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  updateSelectedNode: state.updateSelectedNode,
  updateNodeLabel: state.updateNodeLabel,
  selectedNode: state.selectedNode,
  addChildNode: state.addChildNode,
  bgColor: state.bgColor,
  updateBgColor: state.updateBgColor,
  deleteNodeAndChildren: state.deleteNodeAndChildren,
  isActionButtonVisible: state.isActionButtonVisible,
  toggleActionButton: state.toggleActionButton,
  createMindmap: state.createMindmap,
  mindmap: state.mindmap,
  setSelectedNode: state.setSelectedNode,
  addSiblingNode: state.addSiblingNode,
  selectPreviousSibling: state.selectPreviousSibling,
  selectPreviousNodeInSameColumn: state.selectPreviousNodeInSameColumn,
  selectNextNodeInSameColumn: state.selectNextNodeInSameColumn,
  selectParentNode: state.selectParentNode,
  selectFirstChildNode: state.selectFirstChildNode,
  editingNode: state.editingNode,
  setEditingNode: state.setEditingNode
});

export type IMindmap = {
  id: string;
  title: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  bgColor?: string;
};
