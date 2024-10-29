import React, { useEffect, useState } from "react";
import { selector } from "../types";
import useStore, { RFState } from "../store";
import { darkenHexColor, COLORS } from "../helpers";

const BgColorPicker = () => {
  const { bgColor, updateBgColor } = useStore<RFState>(selector);

  const handleColorSelect = () => {
    const currentIndex = COLORS.indexOf(bgColor);
    const nextIndex = (currentIndex + 1) % COLORS.length;
    updateBgColor(COLORS[nextIndex]);
  };

  return (
    <div>
      <div
        className="flex items-center justify-center py-2 px-3 rounded-lg cursor-pointer"
        style={{ backgroundColor: darkenHexColor(bgColor, 20) }}
        onClick={handleColorSelect}
      >
        <button className="w-5 h-5 rounded-full border-none cursor-pointer" style={{ backgroundColor: bgColor }} />
      </div>
    </div>
  );
};

export default BgColorPicker;
