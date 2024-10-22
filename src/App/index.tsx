import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  ConnectionLineType,
  NodeOrigin,
  Node,
  OnConnectEnd,
  OnConnectStart,
  useReactFlow,
  useStoreApi,
  Controls,
  Panel,
  Background
} from "reactflow";
import { useHotkeys } from "react-hotkeys-hook";

import useStore, { RFState } from "./store";
import MindMapNode from "./MindMapNode";
import MindMapEdge from "./MindMapEdge";

// we need to import the React Flow styles to make it work
import "reactflow/dist/style.css";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  updateSelectedNode: state.updateSelectedNode,
  selectedNode: state.selectedNode
});

const nodeTypes = {
  mindmap: MindMapNode
};

const edgeTypes = {
  mindmap: MindMapEdge
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];

const connectionLineStyle = { stroke: "#000", strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: "mindmap" };

function Flow() {
  const store = useStoreApi();
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode, updateSelectedNode, selectedNode } =
    useStore(selector);
  // const { project } = useReactFlow();
  // const connectingNodeId = useRef<string | null>(null);
  const defaultViewport = { x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 1 };

  // const getChildNodePosition = (event: MouseEvent, parentNode?: Node) => {
  //   const { domNode } = store.getState();

  //   if (
  //     !domNode ||
  //     // we need to check if these properites exist, because when a node is not initialized yet,
  //     // it doesn't have a positionAbsolute nor a width or height
  //     !parentNode?.positionAbsolute ||
  //     !parentNode?.width ||
  //     !parentNode?.height
  //   ) {
  //     return;
  //   }

  //   const { top, left } = domNode.getBoundingClientRect();

  //   // we need to remove the wrapper bounds, in order to get the correct mouse position
  //   const panePosition = project({
  //     x: event.clientX - left,
  //     y: event.clientY - top
  //   });

  //   // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
  //   return {
  //     x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
  //     y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2
  //   };
  // };

  // const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
  //   // we need to remember where the connection started so we can add the new node to the correct parent on connect end
  //   connectingNodeId.current = nodeId;
  // }, []);

  // const onConnectEnd: OnConnectEnd = useCallback(
  //   (event) => {
  //     const { nodeInternals } = store.getState();
  //     const targetIsPane = (event.target as Element).classList.contains("react-flow__pane");
  //     const node = (event.target as Element).closest(".react-flow__node");

  //     if (node) {
  //       node.querySelector("input")?.focus({ preventScroll: true });
  //     } else if (targetIsPane && connectingNodeId.current) {
  //       const parentNode = nodeInternals.get(connectingNodeId.current);
  //       const childNodePosition = getChildNodePosition(event as MouseEvent, parentNode);

  //       if (parentNode && childNodePosition) {
  //         addChildNode(parentNode, childNodePosition);
  //       }
  //     }
  //   },
  //   [getChildNodePosition]
  // );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    console.log("node clicked", node);
    updateSelectedNode(node.id);
    // updateNodeLabel(node.id, "test");
  };

  // Add this hook to handle the Tab key press
  useHotkeys(
    "tab",
    () => {
      console.log("tab pressed");
      if (!selectedNode) return;

      const childNode = addChildNode(selectedNode, { x: selectedNode.position.x + 300, y: selectedNode.position.y });
      updateSelectedNode(childNode.id);
    },
    { preventDefault: true }
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // onConnectStart={onConnectStart}
      // onConnectEnd={onConnectEnd}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={nodeOrigin}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineStyle={connectionLineStyle}
      connectionLineType={ConnectionLineType.Straight}
      defaultViewport={defaultViewport}
      onNodeClick={onNodeClick}
      nodesFocusable
      deleteKeyCode={"Backspace"}
      disableKeyboardA11y={true}
      // fitView
    >
      <Background />
      <Controls showInteractive={false} />
      <Panel position="top-left" className="header">
        React Flow Mind Map
      </Panel>
    </ReactFlow>
  );
}

export default Flow;
