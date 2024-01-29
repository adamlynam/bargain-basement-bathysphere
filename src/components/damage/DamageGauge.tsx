import { ReactElement } from "react";
import Damage from "./Damage";

type DamageGaugeProps = {
  maxDamage: number;
  damageGained: number;
};

const DamageGauge: React.FC<DamageGaugeProps> = ({
  maxDamage,
  damageGained,
}): ReactElement => {
  return (
    <div style={{ width: "100%", float: "left" }}>
      {[...Array(maxDamage)].map((damage, index) => (
        <Damage key={index} damageGained={index < damageGained} />
      ))}
    </div>
  );
};

export default DamageGauge;
