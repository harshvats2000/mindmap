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
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, "flowChartNode")} draggable>
        Input Node
      </div>
    </aside>
  );
};
