import { ReactElement } from "react";
import { HazardData } from "./Hazard";

type LoseOxygenProps = {
  data: HazardData;
};

const LoseOxygen: React.FC<LoseOxygenProps> = ({ data }): ReactElement => {
  return <div>-O2</div>;
};

export default LoseOxygen;
