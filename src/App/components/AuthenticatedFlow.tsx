import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ReactFlow, Background, BackgroundVariant, ConnectionLineType, useReactFlow } from "@xyflow/react";
import useStore from "../store";
import MyPanel from "./Panel";
import { TextUpdaterNode } from "./node";
import { KeyboardShortcutsDialog } from "./KeyboardShortcutsDialog";
import { useHotkeys } from "react-hotkeys-hook";

const AuthenticatedFlow = () => {
  const { id } = useParams();
  const {
    mindmap,
    onNodesChange,
    onEdgesChange,
    bgColor,
    loadMindmap,
    isFetchingMindmap,
    setIsFetchingMindmap,
    addChildNode,
    selectedNode,
    editingNode,
    setEditingNode,
    addSiblingNode,
    selectNextNodeInSameColumn,
    selectPreviousNodeInSameColumn,
    selectParentNode,
    selectFirstChildNode,
    deleteNodeAndChildren
  } = useStore();
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
  const ReactFlowInstance = useReactFlow();

  useEffect(() => {
    setIsFetchingMindmap(true);
    (async () => {
      if (id) {
        await loadMindmap(id);
      }
      setIsFetchingMindmap(false);
    })();
  }, [id, loadMindmap]);

  useEffect(() => {
    ReactFlowInstance.fitView({ duration: 500 });
  }, [mindmap?.nodes]);

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

  if (isFetchingMindmap) {
    return <div>Loading...</div>;
  }

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
      // draggable={false}
      deleteKeyCode={null}
    >
      <Background bgColor={bgColor} variant={BackgroundVariant.Dots} />
      <MyPanel />
      <KeyboardShortcutsDialog />
    </ReactFlow>
  );
};

export default AuthenticatedFlow;
