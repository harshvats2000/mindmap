import React, { useEffect, useMemo, useState } from "react";
import { ReactFlow, ConnectionLineType, useReactFlow, Background, BackgroundVariant, Panel } from "@xyflow/react";
import "../index.css";
import "@xyflow/react/dist/style.css";
import useStore, { RFStatePlay } from "./store-play";
import { selectorPlay } from "./types";
import { TextUpdaterNode } from "./components/playground/playNode";
import MyPanel from "./components/playground/PlayPanel";
import { useHotkeys } from "react-hotkeys-hook";
import { KeyboardShortcutsDialog } from "./components/KeyboardShortcutsDialog";

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
    selectFirstChildNode,
    addSiblingNode,
    deleteNodeAndChildren,
    selectedNode,
    setEditingNode,
    editingNode
  } = useStore<RFStatePlay>(selectorPlay);

  if (!mindmap) {
    createMindmap();
  }

  const ReactFlowInstance = useReactFlow();
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  useHotkeys(
    "tab",
    () => {
      addChildNode();
    },
    [addChildNode]
  );

  useHotkeys(
    "enter",
    () => {
      if (selectedNode) {
        if (selectedNode.id === editingNode) {
          setEditingNode(null);
        } else {
          setEditingNode(selectedNode.id);
        }
      }
    },
    { enableOnFormTags: true },
    [addSiblingNode, selectedNode, setEditingNode, editingNode]
  );

  useHotkeys(
    "shift+enter",
    () => {
      if (selectedNode) {
        if (selectedNode.id === editingNode) {
          setEditingNode(null);
        } else {
          addSiblingNode();
        }
      }
    },
    { enableOnFormTags: true },
    [selectedNode, setEditingNode, editingNode]
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

  useHotkeys("backspace", () => {
    deleteNodeAndChildren();
  });

  useEffect(() => {
    ReactFlowInstance.fitView({ duration: 500 });
  }, [mindmap?.nodes]);

  return (
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
      deleteKeyCode={null}
      // draggable={false}
    >
      <Background bgColor={bgColor} variant={BackgroundVariant.Dots} />
      <MyPanel />

      <KeyboardShortcutsDialog />
    </ReactFlow>
  );
};

export default function App() {
  return <Flow />;
}
