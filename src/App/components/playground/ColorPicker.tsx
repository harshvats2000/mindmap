import { darkenHexColor } from "@/App/helpers";
import useStore, { RFStatePlay } from "@/App/store-play";
import { selectorPlay } from "@/App/types";

const BgColorPicker = () => {
  const { bgColor, updateBgColor } = useStore<RFStatePlay>(selectorPlay);
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
