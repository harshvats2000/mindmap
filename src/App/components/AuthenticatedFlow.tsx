import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ReactFlow, Background, BackgroundVariant, ConnectionLineType, useReactFlow } from "@xyflow/react";
import useStore from "../store";
import MyPanel from "./Panel";
import { TextUpdaterNode } from "./node";

const AuthenticatedFlow = () => {
  const { id } = useParams();
  const { mindmap, onNodesChange, onEdgesChange, bgColor, loadMindmap, isFetchingMindmap, setIsFetchingMindmap } =
    useStore();
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
    >
      <Background bgColor={bgColor} variant={BackgroundVariant.Dots} />
      <MyPanel />
    </ReactFlow>
  );
};

export default AuthenticatedFlow;
