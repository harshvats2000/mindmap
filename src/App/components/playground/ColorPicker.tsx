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

  const handleColorSelect = () => {
    const currentIndex = colors.indexOf(bgColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    updateBgColor(colors[nextIndex]);
  };

  return (
    <div>
      <div
        className="flex items-center justify-center py-2 px-3 rounded-lg cursor-pointer"
        style={{ backgroundColor: darkenHexColor(bgColor, 20) }}
        onClick={handleColorSelect}
      >
        <button className="w-5 h-5 rounded-full border-none" style={{ backgroundColor: bgColor }} />
      </div>
    </div>
  );
};

export default BgColorPicker;
