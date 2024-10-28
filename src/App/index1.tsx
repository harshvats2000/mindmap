import React, { useEffect, useMemo, useState } from "react";
import { ReactFlow, ConnectionLineType, useReactFlow, Background, BackgroundVariant } from "@xyflow/react";
import "../index.css";
import "@xyflow/react/dist/style.css";
import useStore, { RFStatePlay } from "./store-play";
import { selectorPlay } from "./types";
import { TextUpdaterNode } from "./components/playground/playNode";
import MyPanel from "./components/playground/PlayPanel";
import { useHotkeys } from "react-hotkeys-hook";

const Flow = () => {
  const {
    mindmap,
    onNodesChange,
    onEdgesChange,
    bgColor,
    createMindmap,
    addChildNode,
    selectNextNodeInSameColumn,
    selectPreviousNodeInSameColumn,
    selectParentNode,
    selectFirstChildNode
  } = useStore<RFStatePlay>(selectorPlay);

  if (!mindmap) {
    createMindmap();
  }

  const ReactFlowInstance = useReactFlow();
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  useHotkeys(
    "tab",
    (event) => {
      event.preventDefault();
      addChildNode();
    },
    // { enableOnFormTags: true },
    [addChildNode]
  );

  useHotkeys(
    "down",
    () => {
      selectNextNodeInSameColumn();
    },
    [selectNextNodeInSameColumn]
  );

  useHotkeys(
    "up",
    () => {
      selectPreviousNodeInSameColumn();
    },
    [selectPreviousNodeInSameColumn]
  );

  useHotkeys("left", () => {
    selectParentNode();
  });

  useHotkeys("right", () => {
    selectFirstChildNode();
  });

  useEffect(() => {
    ReactFlowInstance.fitView({ duration: 500 });
  }, [mindmap?.nodes]);

  return (
    // <div style={{ width: "2000px", height: "100%" }}>
    <ReactFlow
      nodes={mindmap?.nodes}
      edges={mindmap?.edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      nodeTypes={nodeTypes}
      //   defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
      fitView
      // draggable={false}
    >
      <Background bgColor={bgColor} variant={BackgroundVariant.Dots} />
      <MyPanel />
    </ReactFlow>
    // </div>
  );
};

export default function App() {
  return <Flow />;
}
