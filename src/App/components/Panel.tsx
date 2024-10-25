import { Panel } from "@xyflow/react";
import React from "react";
import BgColorPicker from "./ColorPicker";
import { DownloadButton } from "./DownloadButton";
import Auth from "./Auth";

const MyPanel = () => {
  return (
    <Panel position="top-right">
      <div className="flex flex-row gap-2">
        <BgColorPicker />
        <DownloadButton />
        {/* <Auth /> */}
      </div>
    </Panel>
  );
};

export default MyPanel;
