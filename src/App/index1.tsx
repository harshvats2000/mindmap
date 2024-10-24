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
import { DownloadButton } from "./components/DownloadButton";

const Flow = () => {
  const { nodes, onNodesChange, edges, onEdgesChange, addNode } = useStore<RFState>(selector);
  const ReactFlowInstance = useReactFlow();
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  useHotkeys(
    "tab",
    (event) => {
      event.preventDefault();
      addNode();
    },
    { enableOnFormTags: true },
    [addNode]
  );

  useEffect(() => {
    ReactFlowInstance.fitView({ duration: 500 });
  }, [nodes]);

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
      <DownloadButton />
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
