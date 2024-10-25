import React, { useState, useEffect } from "react";
import { selector } from "../types";
import useStore, { RFState } from "../store";
import { darkenHexColor } from "../helpers";

const SaveButton = () => {
  const { user, bgColor, saveMindmap, isSavingMindmap } = useStore<RFState>(selector);

  if (user) {
    return (
      <div className="flex flex-row justify-between items-center">
        <button className="btn" style={{ backgroundColor: darkenHexColor(bgColor, 20) }} onClick={() => saveMindmap()}>
          {isSavingMindmap ? "Saving..." : "Save"}
        </button>
      </div>
    );
  }

  return null;
};

export default SaveButton;
