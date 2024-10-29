import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import useStore from "../store";
import { NodeData, selector } from "../types";
import { darkenHexColor } from "../helpers";
import UpgradeModal from "./UpgradeModal";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export function TextUpdaterNode({ data, id }: { data: NodeData; id: string }) {
  const {
    updateNodeLabel,
    updateSelectedNode,
    selectedNode,
    addChildNode,
    bgColor,
    deleteNodeAndChildren,
    isActionButtonVisible,
    numberONodes,
    editingNode,
    setEditingNode,
    addSiblingNode
  } = useStore(selector);
  const isSelected = selectedNode?.id === id;
  const inputRef = useRef<HTMLInputElement>(null);
  const darkenColor = darkenHexColor(bgColor, 20);
  const btnBgColor = darkenHexColor(bgColor, 60);
  const btnTextColor = darkenHexColor(bgColor, 10);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isEditing = editingNode === id;

  const addNode = (fn: () => void) => {
    if (numberONodes >= 10) {
      setShowUpgradeModal(true);
    } else {
      fn();
    }
  };

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      updateNodeLabel(id, newValue);
    },
    [updateNodeLabel, id]
  );

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingNode(id);
    },
    [setEditingNode, id]
  );

  const onBlur = useCallback(() => {
    setEditingNode(null);
  }, [setEditingNode]);

  const onSingleClick = useCallback(() => {
    updateSelectedNode(id);
  }, [updateSelectedNode, id]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <div onDoubleClick={onDoubleClick}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div style={{ width: 150, display: "grid", placeItems: "center", position: "relative" }}>
        {isEditing ? (
          <input
            ref={inputRef}
            name="text"
            value={data.label}
            onChange={onChange}
            onBlur={onBlur}
            onClick={onSingleClick}
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
            onClick={onSingleClick}
            className="no-scrollbar"
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
                <DropdownMenuItem onClick={() => addNode(addChildNode)}>
                  Add Child
                  <span className="ml-auto text-xs text-muted-foreground">Tab</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNode(addSiblingNode)}>
                  Add Sibling
                  <span className="ml-auto text-xs text-muted-foreground">⇧ Enter</span>
                </DropdownMenuItem>
                {id !== "root" && (
                  <DropdownMenuItem onClick={() => deleteNodeAndChildren()} className="text-red-600">
                    Delete Node
                    <span className="ml-auto text-xs text-muted-foreground">⌫</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

      {showUpgradeModal && <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />}
    </div>
  );
}
