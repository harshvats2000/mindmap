import { createContext, useContext, useState } from "react";

type DnDType = "flowChartNode";

const defaultValue: [DnDType, (_: DnDType) => void] = ["flowChartNode", (_: DnDType) => {}];
const DnDContext = createContext<[DnDType, (_: DnDType) => void]>(defaultValue);

export const DnDProvider = ({ children }: { children: React.ReactNode }) => {
  const [type, setType] = useState<DnDType>("flowChartNode");

  return <DnDContext.Provider value={[type, setType]}>{children}</DnDContext.Provider>;
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
