import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ConnectionLineType,
  useReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  ConnectionMode
} from "@xyflow/react";
import "../../index.css";
import "./styles.css";
import "@xyflow/react/dist/style.css";
import useStore, { RFState } from "./store";
import { selector } from "./types";
import FlowChartNode from "./Node";
import { useDnD } from "./DnDContext";
import Sidebar from "./Sidebar";
import NodeActions from "./NodeActions";
import ButtonEdge from "./Edge";
import { useHotkeys } from "react-hotkeys-hook";

let id = 0;
const getId = () => `dndnode_${id++}`;

const Flow = () => {
  const {
    mindmap,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    duplicateNode,
    moveNode,
    deleteNode,
    setSelectedNode
  } = useStore<RFState>(selector);

  const { screenToFlowPosition } = useReactFlow();
  const nodeTypes = useMemo(() => ({ flowChartNode: FlowChartNode }), []);
  const edgeTypes = useMemo(() => ({ buttonEdge: ButtonEdge }), []);
  const [type] = useDnD();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `New Node` }
      };

      addNode(newNode);
    },
    [screenToFlowPosition, type]
  );

  useHotkeys("d", () => {
    duplicateNode();
  });

  useHotkeys("up", () => {
    moveNode({ down: -5 });
  });
  useHotkeys("down", () => {
    moveNode({ down: 5 });
  });
  useHotkeys("left", () => {
    moveNode({ right: -5 });
  });
  useHotkeys("right", () => {
    moveNode({ right: 5 });
  });

  useHotkeys("shift+up", () => {
    moveNode({ down: -10 });
  });
  useHotkeys("shift+down", () => {
    moveNode({ down: 10 });
  });
  useHotkeys("shift+left", () => {
    moveNode({ right: -10 });
  });
  useHotkeys("shift+right", () => {
    moveNode({ right: 10 });
  });
  useHotkeys("backspace", () => {
    deleteNode();
  });

  useHotkeys(
    "tab",
    (e) => {
      e.preventDefault();
    },
    { enableOnFormTags: true }
  );

  if (!mindmap) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dndflow">
      <div className="dndflow">
        <ReactFlow
          nodes={mindmap?.nodes}
          edges={mindmap?.edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          deleteKeyCode={null}
          draggable={false}
          onDrop={onDrop}
          onDragOver={onDragOver}
          connectionMode={ConnectionMode.Loose}
          elementsSelectable={false}
          onPaneClick={() => setSelectedNode(null)}
        >
          <Background variant={BackgroundVariant.Dots} />
          <NodeActions />
        </ReactFlow>
      </div>

      <Sidebar />
    </div>
  );
};

export default function FlowChart() {
  return <Flow />;
}
