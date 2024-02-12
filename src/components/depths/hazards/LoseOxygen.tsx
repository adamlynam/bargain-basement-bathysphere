import { ReactElement } from "react";
import { HazardData } from "./Hazard";

type LoseOxygenProps = {
  data: HazardData;
};

const LoseOxygen: React.FC<LoseOxygenProps> = ({ data }): ReactElement => {
  const { used } = data;
  return <div style={{ color: used ? "grey" : "blue" }}>-O2</div>;
};

export default LoseOxygen;
