import React from "react";
import { Panel, useReactFlow, getNodesBounds, getViewportForBounds } from "@xyflow/react";
import { toPng } from "html-to-image";
import { selector } from "../types";
import useStore, { RFState } from "../store";
import { darkenHexColor } from "../helpers";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

export function DownloadButton() {
  const { getNodes } = useReactFlow();
  const { bgColor, toggleActionButton } = useStore<RFState>(selector);
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 0);

    toggleActionButton();
    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: bgColor,
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth.toString(),
        height: imageHeight.toString(),
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
      }
    })
      .then(downloadImage)
      .finally(() => toggleActionButton());
  };

  return (
    <Panel position="top-right">
      <button className="btn" onClick={onClick} style={{ backgroundColor: darkenHexColor(bgColor, 20) }}>
        Download Image
      </button>
    </Panel>
  );
}
