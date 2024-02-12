import { ReactElement } from "react";
import { HazardType } from "./HazardType";
import LoseOxygen from "./LoseOxygen";
import GainStress from "./GainStress";
import GainDamage from "./GainDamage";

type HazardProps = {
  data: HazardData;
};

const Hazard: React.FC<HazardProps> = ({ data }): ReactElement => {
  switch (data.type) {
    case HazardType.LoseOxygen:
      return <LoseOxygen data={data} />;
    case HazardType.GainDamage:
      return <GainDamage data={data} />;
    case HazardType.GainStress:
      return <GainStress data={data} />;
    default:
      return <></>;
  }
};

export default Hazard;

export type HazardData = {
  spaceNumber: number | undefined;
  type: HazardType;
  cost: number;
  used: boolean;
};
