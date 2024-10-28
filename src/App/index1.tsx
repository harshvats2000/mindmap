import React, { useEffect, useMemo, useState } from "react";
import { ReactFlow, ConnectionLineType, useReactFlow, Background, BackgroundVariant, Panel } from "@xyflow/react";
import "../index.css";
import "@xyflow/react/dist/style.css";
import useStore, { RFStatePlay } from "./store-play";
import { selectorPlay } from "./types";
import { TextUpdaterNode } from "./components/playground/playNode";
import MyPanel from "./components/playground/PlayPanel";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const KeyboardShortcutsDialog = () => {
  const shortcuts = [
    { key: "Tab", description: "Add child" },
    { key: "Enter", description: "Edit" },
    { key: "Shift + Enter", description: "Add sibling" },
    { key: "Backspace", description: "Delete node and children" }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="absolute bottom-4 right-4 hidden xl:block">
          Keyboard Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex justify-between">
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                {shortcut.key}
              </kbd>
              <span className="text-sm">{shortcut.description}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {["↑", "↓", "←", "→"].map((key) => (
                <kbd
                  key={key}
                  className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
                >
                  {key}
                </kbd>
              ))}
            </div>
            <span className="text-sm">Navigate</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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

  // useHotkeys("enter", () => {
  //   addSiblingNode();
  // });

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
      deleteKeyCode={null}
      // draggable={false}
    >
      <Background bgColor={bgColor} variant={BackgroundVariant.Dots} />
      <MyPanel />
      <Panel position="bottom-right">
        <KeyboardShortcutsDialog />
      </Panel>
    </ReactFlow>
    // </div>
  );
};

export default function App() {
  return <Flow />;
}
