import { ReactElement } from "react";
import { HazardData } from "./Hazard";

type GainDamageProps = {
  data: HazardData;
};

const GainDamage: React.FC<GainDamageProps> = ({ data }): ReactElement => {
  const { used } = data;
  return <div style={{ color: used ? "grey" : "red" }}>+Fire</div>;
};

export default GainDamage;
