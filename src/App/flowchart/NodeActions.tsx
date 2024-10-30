import React from "react";
import { selector } from "./types";
import useStore, { RFState } from "./store";
import { Panel } from "@xyflow/react";

const NodeActions = () => {
  const { selectedNode, deleteNode } = useStore<RFState>(selector);

  return (
    <Panel position="bottom-center">
      <div>NodeActions</div>
      <button onClick={deleteNode}>Delete</button>
    </Panel>
  );
};

export default NodeActions;
