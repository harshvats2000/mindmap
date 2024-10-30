import { Handle, Position, useConnection } from "@xyflow/react";
import { NodeData, selector } from "./types";
import useStore, { RFState } from "./store";

export default function FlowChartNode({ data, id }: { data: NodeData; id: string }) {
  const connection = useConnection();
  const { setSelectedNode, selectedNode, setEditingNode, editingNode, updateNode } = useStore<RFState>(selector);
  const isSelected = selectedNode === id;
  const isEditing = editingNode === id;

  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  return (
    <div>
      {isEditing ? (
        <input type="text" value={data.label} onChange={(e) => updateNode({ label: e.target.value })} />
      ) : (
        <div
          onDoubleClick={() => setEditingNode(id)}
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
      )}
    </div>
  );
}
