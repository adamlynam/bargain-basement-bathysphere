import { ReactElement } from "react";
import { HazardData } from "./Hazard";

type GainStressProps = {
  data: HazardData;
};

const GainStress: React.FC<GainStressProps> = ({ data }): ReactElement => {
  const { used } = data;
  return <div style={{ color: used ? "grey" : "brown" }}>+Bolt</div>;
};

export default GainStress;
