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
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  selectedNode: state.selectedNode,
  setSelectedNode: state.setSelectedNode,
  deleteNode: state.deleteNode,
  deleteEdge: state.deleteEdge,
  editingNode: state.editingNode,
  setEditingNode: state.setEditingNode,
  updateNode: state.updateNode,
  duplicateNode: state.duplicateNode,
  moveNode: state.moveNode
});
