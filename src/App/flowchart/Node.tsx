import { Handle, Position, useConnection } from "@xyflow/react";
import { NodeData, selector } from "./types";
import useStore, { RFState } from "./store";

export default function FlowChartNode({ data, id }: { data: NodeData; id: string }) {
  const connection = useConnection();
  const { setSelectedNode, selectedNode } = useStore<RFState>(selector);
  const isSelected = selectedNode === id;

  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  return (
    <div>
      <div
        onClick={() => {
          setSelectedNode(id);
        }}
        className="cursor-pointer"
        style={{
          backgroundColor: isSelected ? "#0066ff" : "#ccd9f6"
        }}
      >
        <Handle position={Position.Top} type="target" />

        <Handle position={Position.Bottom} type="source" />
        {data.label}
      </div>
    </div>
  );
}
