import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  useReactFlow,
  ReactFlowProvider,
  Background
} from "@xyflow/react";
import { useHotkeys } from "react-hotkeys-hook";

import "../index.css";
import "@xyflow/react/dist/style.css";
import { TextUpdaterNode } from "./components/node";
import useStore, { RFState } from "./store";
import { selector } from "./types";

const Flow = () => {
  const { nodes, onNodesChange, edges, onEdgesChange, addNodeOnTab } = useStore<RFState>(selector);
  const ReactFlowInstance = useReactFlow();
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  // const onConnect = useCallback(
  //   (params: any) =>
  //     setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
  //   []
  // );

  // const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
  //   setSelectedNode(node);
  // }, []);

  // const onNodeLabelChange = useCallback(
  //   (nodeId: string, newLabel: string) => {
  //     setNodes((prevNodes) =>
  //       prevNodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node))
  //     );
  //   },
  //   [setNodes]
  // );

  useHotkeys(
    "tab",
    (event) => {
      event.preventDefault();
      addNodeOnTab();
    },
    { enableOnFormTags: true },
    [addNodeOnTab]
  );

  useEffect(() => {
    ReactFlowInstance.fitView({ duration: 500 });
  }, [nodes]);

  // useEffect(() => {
  //   setNodes((nodes) =>
  //     nodes.map((node) => ({
  //       ...node,
  //       data: { ...node.data, onNodeLabelChange }
  //     }))
  //   );
  // }, [onNodeLabelChange]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // onConnect={onConnect}
      // onNodeClick={onNodeClick}
      connectionLineType={ConnectionLineType.SmoothStep}
      nodeTypes={nodeTypes}
      // onNodeDoubleClick={(node, event) => {
      //   console.log("node", node);
      // }}
      //   defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
      fitView
      // draggable={false}
    >
      <Background />
      {/* {selectedNode && (
        <Panel position="bottom-center">
          <div>Selected Node: {selectedNode.id}</div>
        </Panel>
      )} */}
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
