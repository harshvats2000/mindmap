import { useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";

export function TextUpdaterNode({ data, id }: { data: any; id: string }) {
  const [isEditing, setIsEditing] = useState(false);

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      data.onNodeLabelChange(id, newValue);
    },
    [data, id]
  );

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <div onDoubleClick={onDoubleClick}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div style={{ minWidth: 150 }}>
        {isEditing ? (
          <input
            id="text"
            name="text"
            value={data.label}
            onChange={onChange}
            onBlur={onBlur}
            autoFocus
            className="nodrag"
            style={{
              border: "none",
              background: "black",
              color: "white",
              padding: "6px 10px",
              borderRadius: 10,
              fontSize: 12
            }}
          />
        ) : (
          <div
            style={{
              border: "none",
              background: "black",
              color: "white",
              padding: "6px 10px",
              borderRadius: 10,
              fontSize: 12,
              lineHeight: "normal"
            }}
          >
            {data.label}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} id="a" style={{ opacity: 0 }} />
    </div>
  );
}
