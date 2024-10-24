import { useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import useStore from "../store";
import { NodeData, selector } from "../types";

export function TextUpdaterNode({ data, id }: { data: NodeData; id: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateNodeLabel, updateSelectedNode, selectedNode } = useStore(selector);

  console.log("hey");

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      updateNodeLabel(id, newValue);
    },
    [updateNodeLabel, id]
  );

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onSingleClick = useCallback(() => {
    updateSelectedNode(id);
  }, []);

  return (
    <div onDoubleClick={onDoubleClick} onClick={onSingleClick}>
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
              background: selectedNode?.id === id ? "#0066ff" : "black",
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
              background: selectedNode?.id === id ? "#0066ff" : "black",
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
