import React, { useEffect, useState } from "react";
import { selector } from "../types";
import useStore, { RFState } from "../store";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

const BgColorPicker = () => {
  const { bgColor, updateBgColor } = useStore<RFState>(selector);
  const [color, setColor] = useColor(bgColor);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  useEffect(() => {
    updateBgColor(color.hex);
  }, [color, updateBgColor]);

  return (
    <div style={{ zIndex: 5, position: "absolute", top: 10, left: 10 }}>
      {isColorPickerOpen ? (
        <div>
          <button className="download-btn" onClick={() => setIsColorPickerOpen(false)}>
            Close Picker
          </button>
          <div>
            <ColorPicker color={color} onChange={setColor} />
          </div>
        </div>
      ) : (
        <button className="download-btn" onClick={() => setIsColorPickerOpen(true)}>
          Background Color
        </button>
      )}
    </div>
  );
};

export default BgColorPicker;
