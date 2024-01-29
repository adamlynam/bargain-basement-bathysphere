import { ReactElement } from "react";
import { HazardData } from "./Hazard";

type GainStressProps = {
  data: HazardData;
};

const GainStress: React.FC<GainStressProps> = ({ data }): ReactElement => {
  return <div>+Bolt</div>;
};

export default GainStress;
