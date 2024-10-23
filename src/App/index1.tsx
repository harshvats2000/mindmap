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
import dagre, { Edge } from "@dagrejs/dagre";

import "../index.css";
import "@xyflow/react/dist/style.css";
import { TextUpdaterNode } from "./components/node";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "LR") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
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

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  [
    {
      id: "1",
      type: "textUpdater",
      data: { label: "Hello" },
      position: { x: 0, y: 0 }
    }
  ],
  []
);

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges as any);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const ReactFlowInstance = useReactFlow();
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
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

  const onNodeLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node))
      );
    },
    [setNodes]
  );

  const addNodeOnTab = useCallback(() => {
    if (selectedNode) {
      const newNodeId = `node-${nodes.length + 1}`;
      const newNodeLabel = `Node ${nodes.length + 1}`;
      const newNode: Node = {
        id: newNodeId,
        data: { label: newNodeLabel, onNodeLabelChange },
        position: { x: 0, y: 0 },
        type: "textUpdater"
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

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges as any);

      setNodes(layoutedNodes as Node[]);
      setEdges(layoutedEdges as any);
    }
  }, [selectedNode, nodes, edges, setNodes, setEdges, onNodeLabelChange]);

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
    ReactFlowInstance.fitView({ duration: 500 });
  }, [nodes]);

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        data: { ...node.data, onNodeLabelChange }
      }))
    );
  }, [onNodeLabelChange]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      connectionLineType={ConnectionLineType.SmoothStep}
      nodeTypes={nodeTypes}
      //   defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
      fitView
      draggable={false}
    >
      <Background />
      {/* <Panel position="top-right">
        <button onClick={() => onLayout("TB")}>vertical layout</button>
        <button onClick={() => onLayout("LR")}>horizontal layout</button>
      </Panel>
      {selectedNode && (
        <Panel position="bottom-center">
          <div>Selected Node: {selectedNode.id}</div>
        </Panel>
      )} */}
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
