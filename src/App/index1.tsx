// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  useReactFlow,
  ReactFlowProvider
} from "@xyflow/react";
import { useHotkeys } from "react-hotkeys-hook";
import dagre from "@dagrejs/dagre";

import "../index.css";
import "@xyflow/react/dist/style.css";

import { initialNodes, initialEdges } from "./nodes-edges";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const ReactFlowInstance = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
    []
  );
  //   const onLayout = useCallback(
  //     (direction) => {
  //       const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);

  //       setNodes([...layoutedNodes]);
  //       setEdges([...layoutedEdges]);
  //     },
  //     [nodes, edges]
  //   );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNodeOnTab = useCallback(() => {
    if (selectedNode) {
      const newNode: Node = {
        id: `node-${nodes.length + 1}`,
        data: { label: `Node ${nodes.length + 1}` },
        position: { x: 0, y: 0 }, // Position will be adjusted by layout
        type: "default"
      };

      const newEdge = {
        id: `edge-${edges.length + 1}`,
        source: selectedNode.id,
        target: newNode.id,
        type: "smoothstep",
        animated: true
      };

      const updatedNodes = [...nodes, newNode];
      const updatedEdges = [...edges, newEdge];

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [selectedNode, nodes, edges, setNodes, setEdges]);

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
    ReactFlowInstance.fitView();
  }, [nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
    >
      <Panel position="top-right">
        {/* <button onClick={() => onLayout("TB")}>vertical layout</button>
        <button onClick={() => onLayout("LR")}>horizontal layout</button> */}
      </Panel>
      {selectedNode && (
        <Panel position="bottom-center">
          <div>Selected Node: {selectedNode.id}</div>
        </Panel>
      )}
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
