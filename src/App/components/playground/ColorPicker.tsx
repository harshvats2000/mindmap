import { darkenHexColor, COLORS } from "@/App/helpers";
import useStore, { RFStatePlay } from "@/App/store-play";
import { selectorPlay } from "@/App/types";

const BgColorPicker = () => {
  const { bgColor, updateBgColor } = useStore<RFStatePlay>(selectorPlay);

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
        <button className="w-5 h-5 rounded-full border-none" style={{ backgroundColor: bgColor }} />
      </div>
    </div>
  );
};

export default BgColorPicker;
