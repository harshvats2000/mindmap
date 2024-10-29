import { Handle, Position } from "@xyflow/react";

import { NodeData, selector } from "./types";

export function FlowChartNode({ data, id }: { data: NodeData; id: string }) {
  return (
    <div>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
