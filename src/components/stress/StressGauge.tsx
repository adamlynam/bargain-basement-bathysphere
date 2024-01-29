import { ReactElement } from "react";
import Stress from "./Stress";

type StressGaugeProps = {
  maxStress: number;
  stressGained: number;
};

const StressGauge: React.FC<StressGaugeProps> = ({
  maxStress,
  stressGained,
}): ReactElement => {
  return (
    <div style={{ width: "100%", float: "left" }}>
      {[...Array(maxStress)].map((stress, index) => (
        <Stress key={index} stressGained={index < stressGained} />
      ))}
    </div>
  );
};

export default StressGauge;
