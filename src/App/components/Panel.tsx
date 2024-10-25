import { Panel } from "@xyflow/react";
import React from "react";
import BgColorPicker from "./ColorPicker";
import { DownloadButton } from "./DownloadButton";
import { Link } from "react-router-dom";
import { selector } from "../types";
import useStore, { RFState } from "../store";
import { darkenHexColor } from "../helpers";
import SaveButton from "./SaveButton";

const MyPanel = () => {
  const { bgColor } = useStore<RFState>(selector);
  return (
    <div>
      <Panel position="top-left">
        <button className="btn" style={{ backgroundColor: darkenHexColor(bgColor, 20) }}>
          <Link to="/dashboard">Dashboard</Link>
        </button>
      </Panel>
      <Panel position="top-right">
        <div className="flex flex-row gap-2">
          <BgColorPicker />
          <DownloadButton />
          <SaveButton />
        </div>
      </Panel>
    </div>
  );
};

export default MyPanel;
