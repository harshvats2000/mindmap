import React from "react";
import { selector } from "./types";
import useStore, { RFState } from "./store";
import { Panel } from "@xyflow/react";

const NodeActions = () => {
  const { selectedNode, deleteNode, setEditingNode } = useStore<RFState>(selector);

  return (
    <Panel position="bottom-center">
      {selectedNode && (
        <>
          <div>NodeActions</div>
          <button onClick={deleteNode}>Delete</button>
          <button onClick={() => setEditingNode(selectedNode)}>Edit</button>
        </>
      )}
    </Panel>
  );
};

export default NodeActions;
