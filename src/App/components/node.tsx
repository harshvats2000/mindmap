import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import useStore from "../store";
import { NodeData, selector } from "../types";

export function TextUpdaterNode({ data, id }: { data: NodeData; id: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateNodeLabel, updateSelectedNode, selectedNode } = useStore(selector);

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

  useEffect(() => {
    setIsEditing(true);
  }, []);

  useEffect(() => {
    if (selectedNode?.id !== id) {
      setIsEditing(false);
    }
  }, [selectedNode]);

  return (
    <div onDoubleClick={onDoubleClick} onClick={onSingleClick}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div style={{ minWidth: 124 }}>
        {isEditing ? (
          <input
            id="text"
            name="text"
            value={data.label}
            onChange={onChange}
            onBlur={onBlur}
            autoFocus
            className="node-input"
            style={{
              border: "none",
              background: selectedNode?.id === id ? "#0066ff" : "black",
              color: "white",
              padding: "7px 10px",
              fontWeight: "normal",
              borderRadius: 10,
              fontSize: 10,
              lineHeight: "normal",
              margin: 0,
              letterSpacing: "0.5px"
            }}
          />
        ) : (
          <div
            style={{
              border: "none",
              background: selectedNode?.id === id ? "#0066ff" : "black",
              color: "white",
              padding: "6px 10px",
              fontWeight: "normal",
              borderRadius: 10,
              fontSize: 10,
              lineHeight: "normal",
              margin: 0,
              letterSpacing: "0.5px"
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
