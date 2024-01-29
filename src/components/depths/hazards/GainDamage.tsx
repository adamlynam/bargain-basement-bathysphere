import { ReactElement } from "react";
import { HazardData } from "./Hazard";

type GainDamageProps = {
  data: HazardData;
};

const GainDamage: React.FC<GainDamageProps> = ({ data }): ReactElement => {
  return <div>+Fire</div>;
};

export default GainDamage;
