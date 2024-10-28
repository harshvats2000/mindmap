import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useHotkeys } from "react-hotkeys-hook";
import { NodeData, selectorPlay } from "@/App/types";
import useStore, { RFStatePlay } from "@/App/store-play";
import { darkenHexColor } from "@/App/helpers";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function TextUpdaterNode({ data, id }: { data: NodeData; id: string }) {
  const [isEditing, setIsEditing] = useState(true);
  const {
    updateNodeLabel,
    updateSelectedNode,
    selectedNode,
    addChildNode,
    addSiblingNode,
    bgColor,
    deleteNodeAndChildren,
    isActionButtonVisible
  } = useStore<RFStatePlay>(selectorPlay);
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

  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false);
    }
  }, [selectedNode]);

  return (
    <div onDoubleClick={onDoubleClick} onClick={onSingleClick}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div style={{ width: 150, display: "grid", placeItems: "center", position: "relative" }}>
        {isEditing ? (
          <input
            ref={inputRef}
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
              fontSize: "8px",
              lineHeight: "normal",
              margin: 0,
              letterSpacing: "0px",
              fontFamily: "monospace",
              width: "150px"
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
              fontSize: "8px",
              lineHeight: "normal",
              margin: 0,
              letterSpacing: "0px",
              fontFamily: "monospace",
              width: "150px",
              maxWidth: "150px",
              whiteSpace: "nowrap"
            }}
          >
            {data.label}
          </div>
        )}

        {isActionButtonVisible && isSelected && (
          <div style={{ position: "absolute", top: "4px", right: "5px" }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    background: isSelected ? "white" : btnBgColor,
                    color: isSelected ? "#0066ff" : btnTextColor,
                    border: "none",
                    borderRadius: "50%",
                    width: "0.9rem",
                    height: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  <MoreVertical size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={addChildNode}>Add Child</DropdownMenuItem>
                <DropdownMenuItem onClick={addSiblingNode}>Add Sibling</DropdownMenuItem>
                {id !== "root" && (
                  <DropdownMenuItem onClick={() => deleteNodeAndChildren(id)} className="text-red-600">
                    Delete Node
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
