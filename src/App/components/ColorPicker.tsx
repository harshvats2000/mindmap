import React, { useEffect, useState } from "react";
import { selector } from "../types";
import useStore, { RFState } from "../store";
// import { ColorPicker, useColor } from "react-color-palette";
// import "react-color-palette/css";
import { darkenHexColor } from "../helpers";

// const BgColorPicker = () => {
//   const { bgColor, updateBgColor } = useStore<RFState>(selector);
//   const [color, setColor] = useColor(bgColor);
//   const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

//   useEffect(() => {
//     updateBgColor(color.hex);
//   }, [color, updateBgColor]);

//   return (
//     <div>
//       {isColorPickerOpen ? (
//         <div>
//           <button
//             className="btn"
//             style={{ backgroundColor: darkenHexColor(bgColor, 20) }}
//             onClick={() => setIsColorPickerOpen(false)}
//           >
//             Close Picker
//           </button>
//           <div>
//             <ColorPicker color={color} onChange={setColor} />
//           </div>
//         </div>
//       ) : (
//         <button
//           className="btn"
//           style={{ backgroundColor: darkenHexColor(bgColor, 20) }}
//           onClick={() => setIsColorPickerOpen(true)}
//         >
//           Background Color
//         </button>
//       )}
//     </div>
//   );
// };

const BgColorPicker = () => {
  const { bgColor, updateBgColor } = useStore<RFState>(selector);
  const colors = [
    "#004B4B", // Very Dark Cyan
    "#4B0000", // Very Dark Red
    "#003200", // Very Dark Green
    "#4B004B", // Very Dark Magenta
    "#0b3158", // Dark Blue
    "#4B2300" // Very Dark Brown (Dark Orange)
  ];

  const handleColorSelect = (color: string) => {
    updateBgColor(color);
  };

  return (
    <div>
      <div className="btn" style={{ backgroundColor: darkenHexColor(bgColor, 20) }}>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full border-none cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BgColorPicker;
