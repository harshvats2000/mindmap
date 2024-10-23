import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  ConnectionLineType,
  NodeOrigin,
  Node,
  OnConnectEnd,
  OnConnectStart,
  useReactFlow,
  useStoreApi,
  Controls,
  Panel,
  Background
} from "reactflow";
import { useHotkeys } from "react-hotkeys-hook";

import useStore, { RFState } from "./store";
import MindMapNode from "./MindMapNode";
import MindMapEdge from "./MindMapEdge";

// we need to import the React Flow styles to make it work
import "reactflow/dist/style.css";
import { selector } from "./types";

const nodeTypes = {
  mindmap: MindMapNode
};

const edgeTypes = {
  mindmap: MindMapEdge
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];

const connectionLineStyle = { stroke: "#555555", strokeWidth: 2 };
const defaultEdgeOptions = { style: connectionLineStyle, type: "mindmap" };

function Flow() {
  const store = useStoreApi();
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode, updateSelectedNode, selectedNode } =
    useStore(selector);
  // const { project } = useReactFlow();
  // const connectingNodeId = useRef<string | null>(null);
  const defaultViewport = { x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 1 };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    console.log("node clicked", node);
    updateSelectedNode(node.id);
    // updateNodeLabel(node.id, "test");
  };

  // Add this hook to handle the Tab key press
  useHotkeys(
    "tab",
    () => {
      if (!selectedNode) return;

      addChildNode();
    },
    { preventDefault: true }
  );

  useEffect(() => {
    updateSelectedNode(nodes[nodes.length - 1].id);
  }, [nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // onConnectStart={onConnectStart}
      // onConnectEnd={onConnectEnd}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={nodeOrigin}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineStyle={connectionLineStyle}
      defaultViewport={defaultViewport}
      onNodeClick={onNodeClick}
      nodesFocusable
      deleteKeyCode={"Backspace"}
      disableKeyboardA11y={true}
      // fitView
    >
      <Background />
      <Controls showInteractive={false} />
      <Panel position="top-left" className="header">
        React Flow Mind Map
      </Panel>
    </ReactFlow>
  );
}

export default Flow;
