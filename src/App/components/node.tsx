import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";

export function TextUpdaterNode({ data, id }: { data: any; id: string }) {
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      data.onNodeLabelChange(id, newValue);
    },
    [data, id]
  );

  return (
    <div>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div style={{}}>
        <input
          id="text"
          name="text"
          value={data.label}
          onChange={onChange}
          className="nodrag"
          style={{ border: "none", background: "black", color: "white", padding: 10, borderRadius: 10 }}
        />
      </div>
      <Handle type="source" position={Position.Right} id="a" style={{ opacity: 0 }} />
    </div>
  );
}
