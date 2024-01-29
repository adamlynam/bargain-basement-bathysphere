import { ReactElement } from "react";
import Oxygen from "./Oxygen";

type OxygenGaugeProps = {
  maxOxygen: number;
  oxygenUsed: number;
};

const OxygenGauge: React.FC<OxygenGaugeProps> = ({
  maxOxygen,
  oxygenUsed,
}): ReactElement => {
  return (
    <div style={{ width: "100%", float: "left" }}>
      {[...Array(maxOxygen)].map((oxygen, index) => (
        <Oxygen key={index} oxygenUsed={index < oxygenUsed} />
      ))}
    </div>
  );
};

export default OxygenGauge;
