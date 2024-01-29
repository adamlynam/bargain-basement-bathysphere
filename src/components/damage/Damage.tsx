import { ReactElement } from "react";

type StressProps = {
  damageGained: boolean;
};

const Damage: React.FC<StressProps> = ({ damageGained }): ReactElement => {
  return (
    <div
      style={{
        float: "left",
        padding: "1em",
        border: "1px solid",
        backgroundColor: damageGained ? "grey" : "",
      }}
    >
      Fire
    </div>
  );
};

export default Damage;
