import { Handle, Position, useConnection } from "@xyflow/react";
import { NodeData, selector } from "./types";

export default function FlowChartNode({ data, id }: { data: NodeData; id: string }) {
  const connection = useConnection();

  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  return (
    <div className="customNode">
      <div
        className="customNodeBody"
        style={{
          borderStyle: isTarget ? "dashed" : "solid",
          backgroundColor: isTarget ? "#ffcce3" : "#ccd9f6"
        }}
      >
        <Handle position={Position.Top} type="target" />

        <Handle position={Position.Bottom} type="source" />
        {data.label}
      </div>
    </div>
  );
}
