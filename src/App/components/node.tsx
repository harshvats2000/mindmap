import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import useStore from "../store";
import { NodeData, selector } from "../types";
import { darkenHexColor } from "../helpers";
// import { useHotkeys } from "react-hotkeys-hook";

export function TextUpdaterNode({ data, id }: { data: NodeData; id: string }) {
  const [isEditing, setIsEditing] = useState(true);
  const { updateNodeLabel, updateSelectedNode, selectedNode, addNode, bgColor, deleteNodeAndChildren } =
    useStore(selector);
  const isSelected = selectedNode?.id === id;
  const inputRef = useRef<HTMLInputElement>(null);
  const darkenColor = darkenHexColor(bgColor, 20);
  const btnBgColor = darkenHexColor(bgColor, 60);
  const btnTextColor = darkenHexColor(bgColor, 10);

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

  // useHotkeys(
  //   "enter",
  //   (event) => {
  //     event.preventDefault();
  //     console.log(isEditing);
  //     if (isEditing) {
  //       setIsEditing(false);
  //     } else {
  //       setIsEditing(true);
  //     }
  //   },
  //   { enableOnFormTags: true }
  // );

  useEffect(() => {
    if (isSelected) {
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [selectedNode]);

  return (
    <div onDoubleClick={onDoubleClick} onClick={onSingleClick}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div style={{ minWidth: 100, display: "grid", placeItems: "center", position: "relative" }}>
        {isEditing ? (
          <input
            ref={inputRef}
            id="text"
            name="text"
            value={data.label}
            onChange={onChange}
            onBlur={onBlur}
            autoFocus
            className="node-input"
            style={{
              border: "none",
              background: isSelected ? "#0066ff" : darkenColor,
              color: "white",
              padding: "6px 10px",
              fontWeight: "normal",
              borderRadius: 10,
              fontSize: 10,
              lineHeight: "normal",
              margin: 0,
              letterSpacing: "0px",
              fontFamily: "monospace",
              width: "100px"
            }}
          />
        ) : (
          <div
            style={{
              overflow: "scroll",
              border: "none",
              background: isSelected ? "#0066ff" : darkenColor,
              color: "white",
              padding: "6px 10px",
              fontWeight: "normal",
              borderRadius: 10,
              fontSize: 10,
              lineHeight: "normal",
              margin: 0,
              letterSpacing: "0px",
              fontFamily: "monospace",
              width: "100px",
              maxWidth: "100px",
              whiteSpace: "nowrap"
            }}
          >
            {data.label}
          </div>
        )}
        <div
          style={{
            width: "1rem",
            height: "1rem",
            background: isSelected ? "white" : btnBgColor,
            color: isSelected ? "#0066ff" : btnTextColor,
            borderRadius: 50,
            display: "grid",
            placeItems: "center",
            fontSize: "0.8rem",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
            position: "absolute",
            top: "4px",
            right: 5,
            lineHeight: "0",
            cursor: "pointer"
          }}
          onClick={() => {
            updateSelectedNode(id);
            addNode();
          }}
        >
          +
        </div>
        <div
          style={{
            width: "1rem",
            height: "1rem",
            background: isSelected ? "white" : btnBgColor,
            color: isSelected ? "#0066ff" : btnTextColor,
            borderRadius: 50,
            display: "grid",
            placeItems: "center",
            fontSize: "0.8rem",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
            position: "absolute",
            top: "4px",
            right: 25,
            lineHeight: "0",
            cursor: "pointer"
          }}
          onClick={() => {
            deleteNodeAndChildren(id);
          }}
        >
          -
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="a" style={{ opacity: 0 }} />
    </div>
  );
}
