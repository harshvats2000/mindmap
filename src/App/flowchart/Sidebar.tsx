import React from "react";
import { useDnD } from "./DnDContext";
import { getNodesBounds, getViewportForBounds, useReactFlow } from "@xyflow/react";
import useStore, { RFState } from "./store";
import { selector } from "./types";
import { toPng } from "html-to-image";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

export default () => {
  const [_, setType] = useDnD();
  const { getNodes } = useReactFlow();
  const { setSelectedNode, toggleDownloading } = useStore<RFState>(selector);
  const onClick = () => {
    toggleDownloading(true);
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 0);

    setSelectedNode(null);
    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: "#fff",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth.toString(),
        height: imageHeight.toString(),
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
      }
    })
      .then(downloadImage)
      .finally(() => toggleDownloading(false));
  };

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

      <div>
        <button onClick={onClick}>Download</button>
      </div>
    </aside>
  );
};
