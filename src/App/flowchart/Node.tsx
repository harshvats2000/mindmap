import { Handle, Position, useConnection } from "@xyflow/react";
import { NodeData, selector } from "./types";
import useStore, { RFState } from "./store";
import { Input } from "@/components/ui/input";

export default function FlowChartNode({ data, id }: { data: NodeData; id: string }) {
  const connection = useConnection();
  const { setSelectedNode, selectedNode, setEditingNode, editingNode, updateNode } = useStore<RFState>(selector);
  const isSelected = selectedNode === id;
  const isEditing = editingNode === id;

  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  return (
    <div style={{ minWidth: 120 }}>
      {isEditing ? (
        <div>
          <Input
            role="hey"
            className="py-0 text-center h-[unset] bg-white shadow-none focus:ring-0"
            type="text"
            value={data.label}
            onChange={(e) => updateNode({ label: e.target.value })}
            style={{ fontSize: "8px" }}
          />
        </div>
      ) : (
        <div
          onDoubleClick={() => setEditingNode(id)}
          onClick={() => {
            setSelectedNode(id);
          }}
          className="cursor-pointer text-center"
          style={{
            backgroundColor: isSelected ? "#0066ff" : "#ccd9f6",
            fontSize: "8px"
          }}
        >
          {data.label}
        </div>
      )}

      <Handle position={Position.Left} type="source" id="left" />
      <Handle position={Position.Top} type="source" id="top" />
      <Handle position={Position.Right} type="source" id="right" />
      <Handle position={Position.Bottom} type="source" id="bottom" />
    </div>
  );
}
