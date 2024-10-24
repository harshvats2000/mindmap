import React, { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ConnectionLineType,
  useReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant
} from "@xyflow/react";
import { useHotkeys } from "react-hotkeys-hook";
import "../index.css";
import "@xyflow/react/dist/style.css";
import { TextUpdaterNode } from "./components/node";
import useStore, { RFState } from "./store";
import { selector } from "./types";
import { DownloadButton } from "./components/DownloadButton";
import BgColorPicker from "./components/ColorPicker";

const Flow = () => {
  const { nodes, onNodesChange, edges, onEdgesChange, addNode, bgColor } = useStore<RFState>(selector);

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
    // <div style={{ width: "2000px", height: "100%" }}>
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
      <Background bgColor={bgColor} variant={BackgroundVariant.Dots} />
      <DownloadButton />
      <BgColorPicker />
    </ReactFlow>
    // </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
