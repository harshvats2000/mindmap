import React, { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ConnectionLineType,
  useReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant
} from "@xyflow/react";
import "../index.css";
import "@xyflow/react/dist/style.css";
import { TextUpdaterNode } from "./components/node";
import useStore, { RFState } from "./store";
import { selector } from "./types";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import MyPanel from "./components/Panel";

const Flow = () => {
  const { nodes, onNodesChange, edges, onEdgesChange, bgColor } = useStore<RFState>(selector);

  const ReactFlowInstance = useReactFlow();
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  useEffect(() => {
    ReactFlowInstance.fitView({ duration: 500 });
  }, [nodes]);

  return (
    // <div style={{ width: "2000px", height: "100%" }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
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
    // </div>
  );
};

export default function App() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
