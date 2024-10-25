import React, { useEffect, useState } from "react";
import { selector } from "../types";
import useStore, { RFState } from "../store";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { darkenHexColor } from "../helpers";

const BgColorPicker = () => {
  const { bgColor, updateBgColor } = useStore<RFState>(selector);
  const [color, setColor] = useColor(bgColor);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  useEffect(() => {
    updateBgColor(color.hex);
  }, [color, updateBgColor]);

  return (
    <div>
      {isColorPickerOpen ? (
        <div>
          <button
            className="btn"
            style={{ backgroundColor: darkenHexColor(bgColor, 20) }}
            onClick={() => setIsColorPickerOpen(false)}
          >
            Close Picker
          </button>
          <div>
            <ColorPicker color={color} onChange={setColor} />
          </div>
        </div>
      ) : (
        <button
          className="btn"
          style={{ backgroundColor: darkenHexColor(bgColor, 20) }}
          onClick={() => setIsColorPickerOpen(true)}
        >
          Background Color
        </button>
      )}
    </div>
  );
};

export default BgColorPicker;
