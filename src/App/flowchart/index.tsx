import React, { useEffect, useMemo, useState } from "react";
import { ReactFlow, ConnectionLineType, useReactFlow, Background, BackgroundVariant, Panel } from "@xyflow/react";
import "../../index.css";
import "@xyflow/react/dist/style.css";
import useStore, { RFState } from "./store";
import { FlowChartNode } from "./Node";
import { selector } from "./types";

const Flow = () => {
  const { mindmap, onNodesChange, onEdgesChange } = useStore<RFState>(selector);

  if (!mindmap) {
    return <div>Loading...</div>;
  }

  const ReactFlowInstance = useReactFlow();
  const nodeTypes = useMemo(() => ({ flowChartNode: FlowChartNode }), []);

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
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
};

export default function FlowChart() {
  return <Flow />;
}
