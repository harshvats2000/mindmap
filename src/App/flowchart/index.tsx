import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactFlow, ConnectionLineType, useReactFlow, Background, BackgroundVariant, Panel } from "@xyflow/react";
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

let id = 0;
const getId = () => `dndnode_${id++}`;

const Flow = () => {
  const { mindmap, onNodesChange, onEdgesChange, onConnect, addNode } = useStore<RFState>(selector);

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
        >
          <Background variant={BackgroundVariant.Dots} />
          {/* <Panel position="top-right">
          <button onClick={() => addNode()}>Add Node</button>
        </Panel> */}
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
