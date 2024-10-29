import React from "react";
import { useDnD } from "./DnDContext";

export default () => {
  const [_, setType] = useDnD();

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: "flowChartNode") => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <h2>Drag and Drop Nodes</h2>
      <div className="dndnode input mt-2" onDragStart={(event) => onDragStart(event, "flowChartNode")} draggable>
        Node
      </div>
    </aside>
  );
};
